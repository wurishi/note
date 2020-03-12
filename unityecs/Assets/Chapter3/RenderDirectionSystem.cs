using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Entitas;

public class RenderDirectionSystem : ReactiveSystem<GameEntity>
{
    public RenderDirectionSystem(Contexts contexts) : base(contexts.game)
    {
    }

    protected override ICollector<GameEntity> GetTrigger(IContext<GameEntity> context)
    {
        return context.CreateCollector(GameMatcher.Direction);
    }

    protected override bool Filter(GameEntity entity)
    {
        return entity.hasDirection && entity.hasView;
    }

    protected override void Execute(List<GameEntity> entities)
    {
        foreach (var e in entities)
        {
            float angle = e.direction.value;
            e.view.gameObject.transform.rotation = Quaternion.AngleAxis(angle, Vector3.forward);
        }
    }
}
