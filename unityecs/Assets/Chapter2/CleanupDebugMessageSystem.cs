using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Entitas;
public class CleanupDebugMessageSystem : ICleanupSystem
{
    private readonly GameContext _context;
    private readonly IGroup<GameEntity> _debugMessages;

    public CleanupDebugMessageSystem(Contexts contexts)
    {
        _context = contexts.game;
        _debugMessages = _context.GetGroup(GameMatcher.DebugMessage);
    }

    public void Cleanup()
    {
        
        foreach (var entity in _debugMessages.GetEntities())
        {
            entity.Destroy();
        }
    }
}
