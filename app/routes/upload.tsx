import { prepareInstructions } from "constant";
import { useState, type ChangeEvent, type FormEvent } from "react";
import Navbar from "~/components/Navbar";
import UploadCard from "~/components/UploadCard";
import { usePuterStore } from "~/lib/puter";
import { convertPdfToImage } from "~/lib/utils";

export default function Upload() {
  const [isProcessing, setProcessing] = useState(false)
  const [statusText, setStatusText] = useState<string>()
  const { ai, auth, fs, kv } = usePuterStore()
  const [file, setFile] = useState<File | null>()

  async function handleAnalyze({ file, companyName, jobTitle, jobDescription }: { file: File, companyName: string, jobTitle: string, jobDescription: string }) {

    //1- subir el archivo y verificar que este se subio correctamente
    setProcessing(true)
    setStatusText("Uploading file...")
    if (!file) {
      return setStatusText("No file selected")
    }
    const uploadFile = await fs.upload([file]);
    if (!uploadFile) {
      return setStatusText("Error uploading file")
    }
    //2- Convertir el pdf a una imagen y verificar que este este correctamente. Luego hace falta subir este mismo archivo
    const newImage = await convertPdfToImage(file)
    if (!newImage) {
      return setStatusText("Error converting file")
    }
    const uploadImage = await fs.upload([newImage]);
    if (!uploadImage) {
      return setStatusText("Error uploading image")
    }
    //3-Crear los datos y luego hacer el analsis del documento
    setStatusText("Analyzing file...")
    const uuid = crypto.randomUUID()
    const data = {
      id: uuid,
      resumePath: uploadFile.path,
      imagePath: uploadImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: '',
    }
    kv.set(`resume:${uuid}`, JSON.stringify(data))
    const aiFeedback = await ai.feedback(uploadFile.path, prepareInstructions({ jobTitle, jobDescription }))
    setStatusText('Getting feedback...')
    if (!aiFeedback) {
      setStatusText('Error: Something wrong generating the feedback')
    }
    const feedbackText = typeof aiFeedback?.message.content === 'string' ?
      aiFeedback?.message.content : aiFeedback?.message.content[0].text
    data.feedback = JSON.parse(feedbackText);
    kv.set(`resume:${uuid}`, JSON.stringify(data))
    setStatusText('Analysis complete, redirecting...')
    setProcessing(false)
    return console.log(data)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget.closest('form')
    if (!form) return
    const formData = new FormData(form)
    const companyName = formData.get('company-name') as string
    const jobTitle = formData.get('job-title') as string
    const jobDescription = formData.get('job-description') as string

    if (!file) {
      return
    }
    await handleAnalyze({ file, companyName, jobTitle, jobDescription })
  }
  function handleFile(selectedFile: File | null) {
    setFile(selectedFile);
  }
  return (
    <main className="bg-cover bg-[url('/images/bg-main.svg')]">
      <Navbar></Navbar>
      <section className="main-section">
        <div className="page-heading ">
          <h1 className="text-center">Smart feedback for your dream job</h1>
          {isProcessing ? (<>
            <h2>{statusText}</h2>
            <img src="/images/resume-scan.gif" className="w-full"></img>
          </>) : (
            <h2>Drop your resume for an ATS score and improvement tips.</h2>
          )}
          {!isProcessing && (
            <form className="flex flex-col py-8" onSubmit={handleSubmit}>
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input name="company-name" id="company-name" type="text" placeholder="Enter company name" />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input name="job-title" id="job-title" type="text" placeholder="Enter job title" />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea name="job-description" rows={5} id="job-title" placeholder="Enter the job description" />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <UploadCard onSelectedFile={handleFile}></UploadCard>
              </div>
              <button type="submit" className="primary-button">Save & Analyze Resume</button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}