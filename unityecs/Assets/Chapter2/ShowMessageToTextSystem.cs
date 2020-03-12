using System.Collections;
using System.Collections.Generic;
using System.Text;
using UnityEngine;
using Entitas;
using UnityEngine.UI;

public class ShowMessageToTextSystem : ReactiveSystem<GameEntity>, IInitializeSystem
{
    private Text text;
    public ShowMessageToTextSystem(Contexts contexts) : base(contexts.game)
    {
    }

    protected override ICollector<GameEntity> GetTrigger(IContext<GameEntity> context)
    {
        return context.CreateCollector(GameMatcher.DebugMessage);
    }

    protected override bool Filter(GameEntity entity)
    {
        return entity.hasDebugMessage;
    }

    protected override void Execute(List<GameEntity> entities)
    {
        // StringBuilder sb = new StringBuilder();
        // foreach (var entity in entities)
        // {
        //     sb.Append(entity.debugMessage.message);
        // }
        // if (null != text)
        // {
        //     text.text = sb.ToString();
        // }
        foreach (var e in entities)
        {
            if (null != text)
            {
                text.text = e.debugMessage.message;
            }
            break;
        }
    }

    public void Initialize()
    {
        var obj = GameObject.Find("Chapter2/Canvas/Text");
        if (null != obj)
        {
            text = obj.GetComponent<Text>();
        }
    }
}
