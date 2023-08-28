export function saveAsFile(text: string, fileName: string = "backup.json") {
  const fileType = "application/json";

  const textFileAsBlob = new Blob([text], { type: fileType });
  const downloadLink = document.createElement("a");
  downloadLink.download = fileName;
  downloadLink.innerHTML = "Download File";

  if (window.webkitURL != null) {
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }

  downloadLink.click();
  downloadLink.remove();

  return downloadLink;
}
