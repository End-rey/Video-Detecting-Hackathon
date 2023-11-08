import  React from 'react';
import cl from './MyModal.module.css'
const MyModal = ({children, ...props}) => {
  const rootClasses = [cl.myModal]
  if (props.visible){
    rootClasses.push(cl.myModal_active)
  }

  return (
      <div className={rootClasses.join(' ')} onClick={() => {
        props.setVisible(false)

      }

      }>
        <div className={cl.myModalContent} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
  );
};

export default MyModal;