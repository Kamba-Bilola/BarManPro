import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const InlineEditableText = ({
  initialText, // The default text to display
  onSave, // Callback function to handle save
  placeholder = "Enter text", // Placeholder for the input
  inputStyle = {}, // Custom styles for the input
  textStyle = {}, // Custom styles for the static text
  buttonStyle = {}, // Custom styles for buttons
  saveButtonLabel = "Save", // Label for save button
  cancelButtonLabel = "Cancel", // Label for cancel button
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const [tempText, setTempText] = useState(initialText);

  const handleSave = () => {
    setText(tempText);
    setIsEditing(false);
    if (onSave) {
      onSave(tempText); // Call the save callback with the updated value
    }
  };

  const handleCancel = () => {
    setTempText(text);
    setIsEditing(false);
  };

  return (
    <span>
      {isEditing ? (
        <span className="d-flex align-items-center">
          <Form.Control
            type="text"
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            size="sm"
            style={{ width: "200px", marginRight: "10px", ...inputStyle }}
            placeholder={placeholder}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            style={{ marginRight: "5px", ...buttonStyle }}
          >
            {saveButtonLabel}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleCancel} style={{ padding: "5px", ...buttonStyle }}>
            {cancelButtonLabel}
          </Button>
        </span>
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            ...textStyle,
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
};

export default InlineEditableText;
