import React, { useState } from 'react';
import axios from 'axios';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Button } from '@nextui-org/react';

interface DownloadSubmissionProps {
  studentID: number;
  assignmentID: number;
}

const DownloadSubmission: React.FC<DownloadSubmissionProps> = ({ studentID, assignmentID }) => {
  const [links, setLinks] = useState<string[]>([]);
  const [fileData, setFileData] = useState<{ uri: string; fileType: string; fileName: string } | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);

  const handleSubmission = async () => {
    if (isViewerOpen) {
      // Close the viewer if it's already open
      setLinks([]);
      setFileData(null);
      setIsViewerOpen(false);
      return;
    }

    try {
      const response = await axios.get(`/api/review-dashboard/downloadSubmission?assignmentID=${assignmentID}&studentID=${studentID}`, {
        responseType: 'json'
      });

      const data = response.data;
      console.log('Submission data:', data);

      if (data.links) {
        // It's an array of links
        setLinks(data.links);
      } else {
        // It's a file
        const fileResponse = await axios.get(`/api/review-dashboard/downloadSubmission?assignmentID=${assignmentID}&studentID=${studentID}`, {
          responseType: 'blob'
        });

        const contentType = fileResponse.headers['content-type'];
        const blob = new Blob([fileResponse.data], { type: contentType });
        const uri = URL.createObjectURL(blob);
        setFileData({ uri, fileType: contentType, fileName: data.fileName });
      }

      // Open the viewer
      setIsViewerOpen(true);
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
      <Button onClick={handleSubmission} variant='light' color={isViewerOpen? "danger" : 'success'}>{isViewerOpen ? 'Close Viewer' : 'View Submission'}</Button>
      {isViewerOpen && (
        <>
          {links.length > 0 && (
            <div>
              <p>Submission Links:</p>
              {links.map((link, index) => (
                <div key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                </div>
              ))}
            </div>
          )}
          {fileData && (
            <div>
              {fileData.fileType === 'application/pdf' && (
                <iframe src={fileData.uri} width="100%" height="600px"></iframe>
              )}
              {fileData.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
                <DocViewer
                  documents={[{ uri: fileData.uri, fileType: fileData.fileType }]}
                  pluginRenderers={DocViewerRenderers}
                />
              )}
              {fileData.fileType === 'text/plain' && (
                <iframe src={fileData.uri} width="100%" height="600px"></iframe>
              )}
              {fileData.fileType === 'application/zip' && (
                <div>
                  <p>Zip file uploaded. Click the button below to download:</p>
                  <Button onClick={handleDownload} variant='flat'>Download</Button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DownloadSubmission;
