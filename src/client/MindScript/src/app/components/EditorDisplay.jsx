import React from 'react'
import Editor from '@monaco-editor/react';
import { Grid, Button } from '@mui/material';
import { useState, useRef } from 'react';



export const EditorDisplay = () => {

  const [content, setContent] = useState('');
  //Objeto para codeExec
  const hwData = {
    code: content,
    id: 'test/test/2',
  }
  const editorRef = useRef(null);

  // console.log(content)


  const handleEditorDidMount = async () => {

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Referrer-Policy': 'no-referrer-when-downgrade'

      },
      mode: 'no-cors',
      body: JSON.stringify({
          // "id": "test/test/2",
          // "code": "def smallest(a, b):\n\treturn a if a < b else b"
          "id" : hwData.id,
          "code" : hwData.code
      })
    }

    fetch('http://34.125.0.99:8001/exec', options)
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })
    
  };

  return (

    <>
      {/* <Button onClick={handleEditorDidMount}>Submit</Button> */}

      <Editor
        // height='60vh'
        language='python'
        theme="vs-dark"
        value={content}
        // value = {'def smallest(a, b):\n\treturn a if a < b else b'}
        onChange={(value) => setContent(value)}
        // onMount={handleEditorDidMount}

      /></>
  );
}