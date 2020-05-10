import React from 'react';
import {
  useField, Field, FieldArray, useFormikContext,
} from 'formik';
import hasIn from 'lodash.hasin';
import shortid from 'shortid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  paddingLeft: 10,
  background: isDragging ? '#fff' : '',
  boxShadow: isDragging ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' : '',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? '#fff' : '',
});

const DraggableDynamicList = ({
  label, fields, schema, ...props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);
  const values = meta.value;
  const errors = meta.error;
  const { touched } = meta;
  const fieldName = field.name;

  const onDragEnd = (result, move) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    move(sourceIndex, destinationIndex);
  };

  const isSingle = values.length <= 1;

  const addListItem = (fn, schema, currentIndex) => {
    const newValue = { ...schema, id: shortid.generate() };

    fn(currentIndex + 1, newValue);
  };

  const setValue = (e, values, groupName, name, itemId) => {
    const index = values.findIndex((value) => value.id === itemId);
    setFieldValue(`${groupName}.[${index}]`, { id: itemId, [name]: e.target.value });
  };

  const getValue = (values, itemId, type) => {
    const valueObject = values.find((value) => value.id === itemId);
    return valueObject[type];
  };

  return (
    <FieldArray
      {...field}
      {...props}
      render={({
        insert, remove, push, move,
      }) => (
        <div style={{ marginBottom: 10, width: '100%' }}>
          <label>{label}</label>
          <DragDropContext onDragEnd={(result) => onDragEnd(result, move)}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {values.map((item, index) => (
                    <Draggable key={item.id || index} draggableId={item.id || `${index}`} index={index}>
                      {(provided, snapshot) => (
                        <div
                          className="flex items-center"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                          )}
                        >
                          <div className="flex items-center w-full">
                            <div style={{ width: '80%', display: 'flex' }} key={index}>
                              {
                                fields.map(({ name, type }) => (
                                  <div style={{ minWidth: 0 }} key={name} className="relative self-start">
                                    <label 
                                      style={{ fontWeight: 400, fontSize: '.65rem' }} 
                                      htmlFor={`${fieldName}.${index}.${name}`}>
                                        {name}
                                    </label>
                                    <Field
                                      value={item[name]}
                                      onChange={(e) => setValue(e, values, props.name, name, item.id)}
                                      name={`${fieldName}.${index}.${name}`}
                                      type={type}
                                    />
                                    {
                                      hasIn(errors, `${index}.${name}`) && touched ? (
                                        <div className="absolute top-0 right-0">
                                          <div style={{ color: 'red', fontSize: '.65rem' }} meta={{ touched: true, error: errors[index][name] }} />
                                        </div>
                                      ) : null
                                    }
                                  </div>
                                ))
                              }
                            </div>
                            <div className="flex h-full text-xl pt-4">
                              <div 
                                className={`ml-1 ${isSingle ? 'invisible' : 'visible'}`} onClick={() => remove(index)} 
                                theme="twoTone" twoToneColor="#aaa" 
                                type="minus-circle">
                                minus
                              </div>
                              <div 
                                className="ml-1" 
                                onClick={() => addListItem(insert, schema, index)} theme="twoTone" 
                                twoToneColor="#ccc" 
                                type="plus-circle">
                                plus
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    />
  );
};

export default DraggableDynamicList;
