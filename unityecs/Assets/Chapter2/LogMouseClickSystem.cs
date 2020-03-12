using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Entitas;
public class LogMouseClickSystem : IExecuteSystem
{
    private readonly GameContext _context;

    public LogMouseClickSystem(Contexts contexts)
    {
        _context = contexts.game;
    }

    public void Execute()
    {
        if (Input.GetMouseButtonDown(0))
        {
            _context.CreateEntity()
                .AddDebugMessage("Left Clicked");
            _context.CreateEntity()
                .AddTextMessage("Hi~~~");
        }

        if (Input.GetMouseButtonDown(1))
        {
            _context.CreateEntity()
                .AddDebugMessage("Right Clicked");
        }
    }
}
