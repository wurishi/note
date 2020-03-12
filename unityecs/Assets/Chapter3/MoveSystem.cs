using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Entitas;

public class MoveSystem : IExecuteSystem, ICleanupSystem
{
    private readonly IGroup<GameEntity> _moves;
    private readonly IGroup<GameEntity> _moveCompletes;
    private const float _speed = 4f;
        
    public MoveSystem(Contexts contexts)
    {
        _moves = contexts.game.GetGroup(GameMatcher.Move);
        _moveCompletes = contexts.game.GetGroup((GameMatcher.MoveComplete));
    }

    public void Execute()
    {
        foreach (var entity in _moves.GetEntities())
        {
            var dir = entity.move.target - entity.position.value;
            var newPosition = entity.position.value + dir.normalized * _speed * Time.deltaTime;
            entity.ReplacePosition(newPosition);

            float angle = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;
            entity.ReplaceDirection(angle);

            float dist = dir.magnitude;
            if (dist <= 0.5f)
            {
                entity.isMoveComplete = true;
            }
        }
    }

    public void Cleanup()
    {
        foreach (var e in _moveCompletes.GetEntities())
        {
            e.isMoveComplete = false;
        }
    }
}
