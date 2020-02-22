using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Graph : MonoBehaviour
{

    public Transform pointPrefab;
    [Range(10,100)]
    public int resolution = 10;
    public GraphFunctionName function;

    Transform[] points;
    

    void Awake()
    {
        points = new Transform[resolution * resolution];

        float step = 2f / resolution;
        Vector3 scale = Vector3.one * step;
        // Vector3 position;
        // position.y = 0f;

        // for(int i = 0, z = 0; z < resolution; z++) {
        //     position.z = (z + 0.5f) * step - 1f;
        //     for(int x = 0; x < resolution; x++, i++) {
        //         Transform point = Instantiate(pointPrefab);
        //         position.x = (x + 0.5f) * step - 1f;
        //         point.localPosition = position;
        //         point.localScale = scale;
        //         point.SetParent(transform, false);
        //         points[i] = point;
        //     }
        // }
        for (int i = 0; i < points.Length; i++)
        {
            Transform point = Instantiate(pointPrefab);
            point.localScale = scale;
            point.SetParent(transform, false);
            points[i] = point;
        }
    }

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        float t = Time.time;
        GraphFunction f = functions[(int)function];

        // for(int i = 0; i < points.Length; i++) {
        //     Transform point = points[i];
        //     Vector3 position = point.localPosition;
        //     position.y = f(position.x, position.z, t);
        //     point.localPosition = position;
        // }
        float step = 2f / resolution;
        for (int i = 0, z = 0; z < resolution; z++)
        {
            float v = (z + 0.5f) * step - 1f;
            for (int x = 0; x < resolution; x++, i++)
            {
                float u = (x + 0.5f) * step - 1f;
                points[i].localPosition = f(u, v, t);
            }
        }
    }

    const float pi = Mathf.PI;

    static Vector3 SineFunction(float x, float z, float t) {
        // return Mathf.Sin(pi * (x + t));
        Vector3 p;
        p.x = x;
        p.y = Mathf.Sign(pi * (x + t));
        p.z = z;
        return p;
    }

    static Vector3 MultiSineFunction(float x, float z, float t) {
        float y = Mathf.Sin(pi * (x + t));
        y += Mathf.Sin(2f * pi * (x + 2f * t)) / 2f;
        y *= 2f / 3f;
        // return y;
        return new Vector3(x, y, z);
    }

    static Vector3 Sine2DFunction(float x, float z, float t) {
        float y = Mathf.Sin(pi * (x + t));
        y += Mathf.Sin(pi * (z + t));
        y *= 0.5f;
        // return y;
        return new Vector3(x, y, z);
    }

    static Vector3 MultiSine2DFunction(float x, float z, float t) {
        float y = 4f * Mathf.Sin(pi * (x + z + t * 0.5f));
        y += Mathf.Sin(pi * (x + t));
        y += Mathf.Sin(2f * pi * (z + 2f * t)) * 0.5f;
        y *= 1f / 5.5f;
        // return y;
        return new Vector3(x, y, z);
    }

    static Vector3 Ripple1 (float x, float z, float t) {
        float d = Mathf.Sqrt(x * x + z * z);
        float y = d;
        // return y;
        return new Vector3(x, y, z);
    }

    static Vector3 Ripple2 (float x, float z, float t) {
        float d = Mathf.Sqrt(x * x + z * z);
        float y = Mathf.Sin(pi * d);
        // return y;
        return new Vector3(x, y, z);
    }

    static Vector3 Ripple3 (float x, float z, float t) {
        float d = Mathf.Sqrt(x * x + z * z);
        float y = Mathf.Sin(4f * pi * d);
        // return y;
        return new Vector3(x, y, z);
    }

    static Vector3 Ripple4 (float x, float z, float t) {
        float d = Mathf.Sqrt(x * x + z * z);
        float y = Mathf.Sin(pi * (4f * d - t));
        // return y;
        return new Vector3(x, y, z);
    }

    static Vector3 Cylinder(float u, float v, float t)
    {
        Vector3 p;
        p.x = Mathf.Sin(pi * u);
        p.y = 0f;
        p.z = Mathf.Cos(pi * u);
        return p;
    }
    
    static Vector3 Cylinder1(float u, float v, float t)
    {
        Vector3 p;
        p.x = Mathf.Sin(pi * u);
        p.y = u;
        p.z = Mathf.Cos(pi * u);
        return p;
    }
    
    static Vector3 Cylinder2(float u, float v, float t)
    {
        Vector3 p;
        p.x = Mathf.Sin(pi * u);
        p.y = v;
        p.z = Mathf.Cos(pi * u);
        return p;
    }
    
    static Vector3 Star6(float u, float v, float t)
    {
        float r = 1f + Mathf.Sin(6f * pi * u) * 0.2f;
        Vector3 p;
        p.x = r * Mathf.Sin(pi * u);
        p.y = v;
        p.z = r * Mathf.Cos(pi * u);
        return p;
    }
    
    static Vector3 Cylinder3(float u, float v, float t)
    {
        float r = 1f + Mathf.Sin(2f * pi * v) * 0.2f;
        Vector3 p;
        p.x = r * Mathf.Sin(pi * u);
        p.y = v;
        p.z = r * Mathf.Cos(pi * u);
        return p;
    }
    
    static Vector3 Cylinder4(float u, float v, float t)
    {
        float r = 0.8f + Mathf.Sin(pi * (6f * u + 2f * v + t)) * 0.2f;
        Vector3 p;
        p.x = r * Mathf.Sin(pi * u);
        p.y = v;
        p.z = r * Mathf.Cos(pi * u);
        return p;
    }

    static Vector3 Sphere(float u, float v, float t)
    {
        Vector3 p;
        float r = Mathf.Cos(pi * 0.5f * v);
        p.x = r * Mathf.Sin(pi * u);
        p.y = v;
        p.z = r * Mathf.Cos(pi * u);
        return p;
    }
    
    static Vector3 Sphere1(float u, float v, float t)
    {
        Vector3 p;
        float r = Mathf.Cos(pi * 0.5f * v);
        p.x = r * Mathf.Sin(pi * u);
        p.y = Mathf.Sin(pi * 0.5f * v);
        p.z = r * Mathf.Cos(pi * u);
        return p;
    }

    static GraphFunction[] functions = {
        SineFunction,
        Sine2DFunction,
        MultiSineFunction,
        MultiSine2DFunction,
        Ripple1,
        Ripple2,
        Ripple3,
        Ripple4,
        Cylinder,
        Cylinder1,
        Cylinder2,
        Star6,
        Cylinder3,
        Cylinder4,
        Sphere,
        Sphere1
    };
}
