// // components/student/download-submission.tsx
// import React from 'react';
// import axios from 'axios';

// interface DownloadSubmissionProps {
//   studentID: number;
//   assignmentID: number;
// }

// const DownloadSubmission: React.FC<DownloadSubmissionProps> = ({ studentID, assignmentID }) => {
//   const downloadFile = async () => {
//     try {
//       const response = await axios.get(`/api/review-dashboard/downloadSubmission?assignmentID=${assignmentID}&studentID=${studentID}`, {
//         responseType: 'blob'
//       });
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', response.headers['content-disposition'].split('filename=')[1]);
//       document.body.appendChild(link);
//       link.click();
//     } catch (error) {
//       console.error('Error downloading the file', error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={downloadFile}>Download File</button>
//     </div>
//   );
// };

// export default DownloadSubmission;

// components/student/download-submission.tsx
import React, { useState } from 'react';
import axios from 'axios';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

interface DownloadSubmissionProps {
  studentID: number;
  assignmentID: number;
}

const DownloadSubmission: React.FC<DownloadSubmissionProps> = ({ studentID, assignmentID }) => {
  const [link, setLink] = useState<string | null>(null);
  const [fileData, setFileData] = useState<{ uri: string; fileType: string; fileName: string } | null>(null);

  const handleSubmission = async () => {
    try {
      const response = await axios.get(`/api/review-dashboard/downloadSubmission?assignmentID=${assignmentID}&studentID=${studentID}`, {
        responseType: 'blob'
      });

      const contentType = response.headers['content-type'];

      if (contentType === 'application/json') {
        // It's a link
        const reader = new FileReader();
        reader.onload = () => {
          const result = JSON.parse(reader.result as string);
          if (result.type === 'link') {
            setLink(result.content);
          }
        };
        reader.readAsText(response.data);
      } else {
        // It's a file
        const blob = new Blob([response.data], { type: contentType });
        const uri = URL.createObjectURL(blob);
        const fileName = response.headers['x-file-name'] ? decodeURIComponent(response.headers['x-file-name']) : 'download';
        setFileData({ uri, fileType: contentType, fileName });
      }
    } catch (error) {
      console.error('Error handling the submission', error);
    }
  };

  const handleDownload = () => {
    if (fileData) {
      const link = document.createElement('a');
      link.href = fileData.uri;
      link.download = fileData.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <button onClick={handleSubmission}>View Submission</button>
      {link && (
        <div>
          <p>Submission Link:</p>
          <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
        </div>
      )}
      {fileData && (
        <div>
          <DocViewer
            documents={[{ uri: fileData.uri, fileType: fileData.fileType }]}
            pluginRenderers={DocViewerRenderers}
          />
          <button onClick={handleDownload}>Download</button>
        </div>
      )}
    </div>
  );
};

export default DownloadSubmission;