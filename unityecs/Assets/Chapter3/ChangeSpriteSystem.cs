using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Entitas;

public class ChangeSpriteSystem : IExecuteSystem
{
    private readonly IGroup<GameEntity> _sprites;

    public ChangeSpriteSystem(Contexts contexts)
    {
        _sprites = contexts.game.GetGroup(GameMatcher.Sprite);
    }

    public void Execute()
    {
        if (Input.GetMouseButtonDown(2))
        {
            foreach (var entity in _sprites.GetEntities())
            {
                if (entity.sprite.name.Equals("head2"))
                {
                    entity.ReplaceSprite("head1");
                }
                else
                {
                    entity.ReplaceSprite("head2");
                }
            } 
        }
    }
}
