using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Entitas;
public class EmitInputSystem : IInitializeSystem, IExecuteSystem
{
    private readonly InputContext _inputContext;
    private InputEntity _leftMouseEntity;
    private InputEntity _rightMouseEntity;
    
    public EmitInputSystem(Contexts contexts)
    {
        _inputContext = contexts.input;
    }

    public void Initialize()
    {
        _inputContext.isLeftMouse = true;
        _inputContext.isRightMouse = true;
        _leftMouseEntity = _inputContext.leftMouseEntity;
        _rightMouseEntity = _inputContext.rightMouseEntity;
    }

    public void Execute()
    {
        var mousePosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        replacePositionProcess(_leftMouseEntity, 0, mousePosition);
        replacePositionProcess(_rightMouseEntity, 1, mousePosition);
    }

    void replacePositionProcess(InputEntity entity, int buttonNum, Vector2 position)
    {
        if (Input.GetMouseButtonDown(buttonNum))
        {
            entity.ReplaceMouseDown(position);
        }

        if (Input.GetMouseButton(buttonNum))
        {
            entity.ReplaceMousePosition(position);
        }

        if (Input.GetMouseButtonUp(buttonNum))
        {
            entity.ReplaceMouseUp(position);
        }
    }
}
