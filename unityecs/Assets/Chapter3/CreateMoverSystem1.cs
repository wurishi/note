using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Entitas;

public class CreateMoverSystem1 : ReactiveSystem<InputEntity>
{
   private readonly IGroup<GameEntity> _movers;

   public CreateMoverSystem1(Contexts contexts) : base(contexts.input)
   {
      _movers = contexts.game.GetGroup(GameMatcher.Mover);
   }

   protected override ICollector<InputEntity> GetTrigger(IContext<InputEntity> context)
   {
      return context.CreateCollector(InputMatcher.AllOf(InputMatcher.LeftMouse, InputMatcher.MouseDown));
   }

   protected override bool Filter(InputEntity entity)
   {
      return entity.hasMouseDown;
   }

   protected override void Execute(List<InputEntity> entities)
   {
      if (entities.Count > 0)
      {
         var entity = entities[0];
         foreach (var gameEntity in _movers.GetEntities())
         {
            gameEntity.ReplaceMove(entity.mouseDown.position);
         }
      }
   }
}
