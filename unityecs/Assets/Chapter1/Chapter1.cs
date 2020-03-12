using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Entitas;

public class Chapter1 : MonoBehaviour
{
    private Systems _systems;
    // Start is called before the first frame update
    void Start()
    {
        var contexts = Contexts.sharedInstance;
        
        _systems = new Feature("System")
            .Add(new Chapter1Feature(contexts));
        
        _systems.Initialize();
    }

    // Update is called once per frame
    void Update()
    {
        _systems.Execute();
        _systems.Cleanup();
    }
}
