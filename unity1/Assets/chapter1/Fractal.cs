using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Fractal : MonoBehaviour
{
    private static Vector3[] childDirections =
    {
        Vector3.up,
        Vector3.right,
        Vector3.left,
        Vector3.forward,
        Vector3.back
    };

    private static Quaternion[] childOrientations =
    {
        Quaternion.identity, 
        Quaternion.Euler(0f,0f,-90f),
        Quaternion.Euler(0f,0f,90f),
        Quaternion.Euler(90f,0f,0f),
        Quaternion.Euler(-90f,0f,0f), 
    };
    
    // public Mesh mesh;
    public Mesh[] meshes;
    public Material material;

    public int maxDepth;
    private int depth;

    public float childScale;

    private Material[,] materials;

    private void InitializeMaterials()
    {
        materials = new Material[maxDepth + 1, 2];
        for (int i = 0; i <= maxDepth; i++)
        {
            float t = i / (maxDepth - 1f);
            t *= t;
            materials[i, 0] = new Material(material);
            // materials[i].color = Color.Lerp(Color.white, Color.yellow, (float) i / (float) maxDepth);
            materials[i, 0].color = Color.Lerp(Color.white, Color.yellow, t);
            
            materials[i, 1] = new Material(material);
            materials[i, 1].color = Color.Lerp(Color.white, Color.cyan, t);
        }
        materials[maxDepth, 0].color = Color.magenta;
        materials[maxDepth, 1].color = Color.red;
    }

    public float maxRotationSpeed;

    private float rotationSpeed;

    public float maxTwist;
    // Start is called before the first frame update
    void Start()
    {
        transform.Rotate(Random.Range(-maxTwist,maxTwist),0f,0f);
        rotationSpeed = Random.Range(-maxRotationSpeed, maxRotationSpeed);
        if (materials == null)
        {
            InitializeMaterials();
        }
        gameObject.AddComponent<MeshFilter>().mesh = meshes[Random.Range(0,meshes.Length)];
        // 因为每次创建都是一个新的材质副本,动态合批无法生效
        // gameObject.AddComponent<MeshRenderer>().material = material;
        // GetComponent<MeshRenderer>().material.color = Color.Lerp(Color.white, Color.yellow, (float) depth / (float) maxDepth);
        gameObject.AddComponent<MeshRenderer>().material = materials[depth, Random.Range(0, 2)];
        if (depth < maxDepth)
        {
            StartCoroutine(CreateChildren());
        }
    }

    public float spawnProbability;
    private IEnumerator CreateChildren()
    {
        for (int i = 0; i < childDirections.Length; i++)
        {
            if(Random.value < spawnProbability) {
                yield return new WaitForSeconds(Random.Range(0.1f, 0.5f));
                new GameObject("Fractal Child").AddComponent<Fractal>().Initialize(this, i);
            }
        }
    }

    private void Initialize(Fractal parent, int childIndex)
    {
        maxTwist = parent.maxTwist;
        maxRotationSpeed = parent.maxRotationSpeed;
        spawnProbability = parent.spawnProbability;
        meshes = parent.meshes;
        // material = parent.material;
        materials = parent.materials;
        maxDepth = parent.maxDepth;
        depth = parent.depth + 1;
        childScale = parent.childScale;
        transform.parent = parent.transform;
        transform.localScale = Vector3.one * childScale;
        transform.localPosition = childDirections[childIndex] * (0.5f + 0.5f * childScale);
        transform.localRotation = childOrientations[childIndex];
    }

    // Update is called once per frame
    void Update()
    {
        transform.Rotate(0f,rotationSpeed*Time.deltaTime,0f);
    }
}
