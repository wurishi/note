using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Entitas;

public class RenderSpriteSystem : ReactiveSystem<GameEntity>
{
    public RenderSpriteSystem(Contexts contexts) : base(contexts.game)
    {
        
    }

    protected override ICollector<GameEntity> GetTrigger(IContext<GameEntity> context)
    {
        return context.CreateCollector(GameMatcher.Sprite);
    }

    protected override bool Filter(GameEntity entity)
    {
        return entity.hasSprite && entity.hasView;
    }

    protected override void Execute(List<GameEntity> entities)
    {
        foreach (var entity in entities)
        {
            var go = entity.view.gameObject;
            var sr = go.GetComponent<SpriteRenderer>();
            if (null == sr)
            {
                sr = go.AddComponent<SpriteRenderer>();
            }

            sr.sprite = Resources.Load<Sprite>(entity.sprite.name);
        }
    }
}
