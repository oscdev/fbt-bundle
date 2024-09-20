import React from 'react'
import { Modal} from "@shopify/polaris";

export function Confirm(props) {
  //Variables performing onClick Actions
  const { isConfirm, confirmMsg, onConfirm, onCancel, returnData} = props;//Elements call from product rule component
  const toggleActive = onCancel;

  function deleteRule() {
    onConfirm(returnData);
  }
  return (
    //Onclick delete button open modal for confirmation dialog box
    <Modal
      open={isConfirm}
      onClose={toggleActive}
      small      
      title={confirmMsg}
      primaryAction={{
        content: "Confirm",
        destructive: true,
        onAction: deleteRule, //on click confirm button Id deleted
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: onCancel,  //on click cancel button back to the same page
        },
      ]}
    ></Modal>
  )
}
