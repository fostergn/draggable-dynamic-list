import React from 'react';
import { Formik, Field } from 'formik';
import hasIn from 'lodash.hasin';
import { action } from '@storybook/addon-actions';
import DraggableDynamicList from '../lib/DraggableDynamicList';

export default {
  title: 'Draggable Dynamic List',
  component: DraggableDynamicList,
};

const initialValues = {
  sets: [{ set: '8' }],
}

export const ToStorybook = () => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={action('submit')}
    >
    {
      ({
        handleSubmit
      }) => (
        <form onSubmit={handleSubmit} className="flex flex-col">
          <DraggableDynamicList
            label="Sets"
            name="sets"
            schema={{ set: '' }}
            fields={[
              {
                name: 'set',
                type: 'text',
              },
            ]}
          >
            {
              ({
                fieldName,
                itemId,
                name,
                type,
                setValue,
                value,
                index,
                error
              }) => (
                <>
                  <label 
                    htmlFor={`${fieldName}.${index}.${name}`}>
                      {name}
                  </label>
                  <Field
                    value={value}
                    onChange={({ target: { value }}) => setValue(value, name, itemId)}
                    name={`${fieldName}.${index}.${name}`}
                    type={type}
                  />
                  {
                    error ? (
                      <div 
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0
                        }}>                                          
                      <div 
                        style={{ color: 'red', fontSize: '.65rem' }} 
                        meta={{ touched: true, error }} 
                      />
                      </div>
                    ) : null
                  } 
                </>
              )
            }
          </DraggableDynamicList>
          <input style={{marginTop: 20}} type="submit" value="Submit" />
        </form>
      )}
    </Formik>
  )
}

ToStorybook.story = {
  name: 'to Storybook',
};
