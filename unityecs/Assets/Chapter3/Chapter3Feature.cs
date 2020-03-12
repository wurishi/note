using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Entitas;
public class Chapter3Feature : Feature
{
    public Chapter3Feature(Contexts contexts) : base("Chapter3Feature")
    {
        Add(new EmitInputSystem(contexts));
        Add(new CreateMoverSystem(contexts));
        Add(new AddViewSystem(contexts));
        Add(new RenderSpriteSystem(contexts));
        Add(new RenderPositionSystem(contexts));
        Add(new RenderDirectionSystem(contexts));
        Add(new CreateMoverSystem1(contexts));
        Add(new MoveSystem(contexts));
        Add(new ChangeSpriteSystem(contexts));
    }
}
