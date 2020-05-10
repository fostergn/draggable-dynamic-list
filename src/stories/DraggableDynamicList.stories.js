import React from 'react';
import { Formik } from 'formik';
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
      onSubmit={(values) => action('submit', values)}
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
          />
        </form>
      )}
    </Formik>
  )
}

ToStorybook.story = {
  name: 'to Storybook',
};
