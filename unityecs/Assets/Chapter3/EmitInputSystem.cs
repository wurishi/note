using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Entitas;
using UnityEngine.EventSystems;

public class EmitInputSystem : IInitializeSystem, IExecuteSystem
{
    private readonly InputContext _inputContext;
    private InputEntity _leftMouseEntity;
    private InputEntity _rightMouseEntity;
    private InputEntity _logPositionEntity;
    
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

        _inputContext.isLogPosition = true;
        _logPositionEntity = _inputContext.logPositionEntity;
        
    }

    public void Execute()
    {
        // Vector2 mousePosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        // var mousePosition = new Vector2(Input.mousePosition.x / 100f, Input.mousePosition.y / 100f);
        // var mousePosition = Input.mousePosition;
        // mousePosition.z = 0;
        // mousePosition = Camera.main.ScreenToWorldPoint(new Vector3(100f, 100f));
        // Debug.Log(Camera.main.nearClipPlane);
        var mousePosition = Camera.main.ScreenToWorldPoint(new Vector3(Input.mousePosition.x, Input.mousePosition.y,
            10f));
        replacePositionProcess(_leftMouseEntity, 0, mousePosition);
        replacePositionProcess(_rightMouseEntity, 1, mousePosition);

        _logPositionEntity.ReplaceMousePosition(mousePosition);
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
