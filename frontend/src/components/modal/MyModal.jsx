import  React from 'react';
import cl from './MyModal.module.css'
const MyModal = ({children,visible,setVisible, cleanInput}) => {
  const rootClasses = [cl.myModal]
  if (visible){
    rootClasses.push(cl.myModal_active)
  }

  return (
      <div className={rootClasses.join(' ')} onClick={() => {
        setVisible(false)
        cleanInput()
      }

      }>
        <div className={cl.myModalContent} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
  );
};

export default MyModal;