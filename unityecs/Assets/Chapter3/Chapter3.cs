using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Entitas;

public class Chapter3 : MonoBehaviour
{
    private Systems _systems;
    // Start is called before the first frame update
    void Start()
    {
        var contexts = Contexts.sharedInstance;
        // contexts.input
        
        _systems = new Feature()
            .Add(new Chapter3Feature(contexts));
        
        _systems.Initialize();
    }

    // Update is called once per frame
    void Update()
    {
        _systems.Execute();
        _systems.Cleanup();
    }
}
