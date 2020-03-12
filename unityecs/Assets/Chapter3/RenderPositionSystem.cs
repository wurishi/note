using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Entitas;

public class RenderPositionSystem : ReactiveSystem<GameEntity>
{
    public  RenderPositionSystem(Contexts contexts) : base(contexts.game) {}

    protected override ICollector<GameEntity> GetTrigger(IContext<GameEntity> context)
    {
        return context.CreateCollector(GameMatcher.Position);
    }

    protected override bool Filter(GameEntity entity)
    {
        return entity.hasView && entity.hasPosition;
    }

    protected override void Execute(List<GameEntity> entities)
    {
        foreach (var entity in entities)
        {
            entity.view.gameObject.transform.position = entity.position.value;
        }
    }
}
