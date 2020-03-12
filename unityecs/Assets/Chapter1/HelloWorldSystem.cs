using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Entitas;

public class HelloWorldSystem : IInitializeSystem
{
    private readonly GameContext _context;

    public HelloWorldSystem(Contexts contexts)
    {
        _context = contexts.game;
    }

    public void Initialize()
    {
        _context.CreateEntity()
            .AddDebugMessage("Hello World");
        
        var index = GameComponentsLookup.DebugMessage;
        var type = typeof(DebugMessageComponent);
        var entity = _context.CreateEntity();
        // var dm = entity.CreateComponent(index, type) as DebugMessageComponent;
        var dm = entity.CreateComponent<DebugMessageComponent>(index);
        dm.message = "Haaaaaaaaaaaaa";
        entity.AddComponent(index, dm);
        dm.message = "123";
    }
}
