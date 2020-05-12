import React from 'react';
import {
  useField, FieldArray, useFormikContext,
} from 'formik';
import PropTypes from 'prop-types';
import get from 'lodash.get';
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
  label, 
  fields, 
  schema,
  removeButton, 
  addButton,
  children,
  name: groupName,
  ...props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(groupName);
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

  const hasSingleValue = values.length <= 1;

  const addListItem = (fn, schema, currentIndex) => {
    const newValue = { ...schema, id: shortid.generate() };

    fn(currentIndex + 1, newValue);
  };

  const setValue = (value, name, itemId) => {
    const index = values.findIndex((value) => value.id === itemId);
    setFieldValue(`${groupName}.[${index}]`, { id: itemId, [name]: value });
  };

  return (
    <FieldArray
      {...field}
      {...props}
      render={({
        insert, remove, move,
      }) => (
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
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                          ),
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%'}}>
                          <div style={{ width: '80%', display: 'flex' }} key={index}>
                            {
                              fields.map(({ name, type }) => (
                                <div 
                                  style={{ 
                                    minWidth: 0, 
                                    position: 'relative', 
                                    alignSelf: 'flex-start',
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                  }} 
                                  key={name}>
                                  {children({
                                    fieldName,
                                    itemId: item.id,
                                    name,
                                    type,
                                    setValue,
                                    value: item[name],
                                    index,
                                    touched,
                                    error: touched ? get(errors, '[index][name]') : null
                                  })}
                                </div>
                              ))
                            }
                          </div>
                          <div style={{ display: 'flex', height: '100%', cursor: 'pointer' }}>
                            <div 
                              style={{
                                visibility: hasSingleValue ? 'hidden' : 'visible'
                              }}
                              onClick={() => remove(index)}>
                              { removeButton }
                            </div>
                            <div 
                              style={{marginLeft: 5}}
                              onClick={() => addListItem(insert, schema, index)}>
                              { addButton }
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
      )}
    />
  );
};

DraggableDynamicList.propTypes = {
  label: PropTypes.string, 
  fields: PropTypes.array, 
  schema: PropTypes.object,
  removeButton: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]), 
  addButton: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]), 
}

DraggableDynamicList.defaultProps = {
  removeButton: 'remove',
  addButton: 'add',
}

export default DraggableDynamicList;
