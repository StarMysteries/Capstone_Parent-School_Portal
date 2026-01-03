import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"

export const RegisterCard = ()  =>{
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [students, setStudents] = useState([{ id: 1, lrn: "" }])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleStudentChange = (id: number, lrn: string) => {
    setStudents(students.map(student =>
      student.id === id ? { ...student, lrn } : student
    ))
  }

  const addStudent = () => {
    setStudents([...students, { id: students.length + 1, lrn: "" }])
  }

  const removeStudent = (id: number) => {
    setStudents(students.filter(student => student.id !== id))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setUploadedFiles(prev => [...prev, ...Array.from(files)])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    console.log("Registration data:", { ...formData, students, uploadedFiles })
    alert("Registration submitted!")
  }

  return (
    <div className="mt-20">
      <div className="bg-[#f9f6c8] rounded-3xl p-8 pt-10 mx-auto max-w-7xl">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8">
            {/* Left Section - Parent Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="relative h-20 w-20 shrink-0">
                  <img src="/Logo.png" alt="School Logo" className="object-contain h-full w-full" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Register as a Parent</h1>
              </div>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="h-14 rounded-full border-2 border-gray-900 bg-white px-6 text-lg placeholder:text-gray-500"
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="h-14 rounded-full border-2 border-gray-900 bg-white px-6 text-lg placeholder:text-gray-500"
                />
                <Input
                  type="tel"
                  placeholder="Contact Number"
                  value={formData.contact}
                  onChange={(e) => handleInputChange("contact", e.target.value)}
                  className="h-14 rounded-full border-2 border-gray-900 bg-white px-6 text-lg placeholder:text-gray-500"
                />
                <Input
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="h-14 rounded-full border-2 border-gray-900 bg-white px-6 text-lg placeholder:text-gray-500"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-14 rounded-full border-2 border-gray-900 bg-white px-6 text-lg placeholder:text-gray-500"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="h-14 rounded-full border-2 border-gray-900 bg-white px-6 text-lg placeholder:text-gray-500"
                />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="h-14 rounded-full border-2 border-gray-900 bg-white px-6 text-lg placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px bg-gray-900" />

            {/* Right Section - Children Information */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Children</h2>

              {/* Registration Requirements */}
              <div className="space-y-3 mb-8">
                <p className="text-red-700 italic font-semibold text-base">Registration Requirements:</p>
                <ul className="space-y-2 text-red-700 font-bold text-base list-disc list-inside">
                  <li>
                    <span className="italic">Parent's Birth Certificate</span>
                  </li>
                  <li>
                    <span className="italic">Government-issued ID</span>{" "}
                    <span className="italic font-normal">if Parent's Birth Certificate is not available.</span>
                  </li>
                  <li>
                    <span className="italic">Child's Birth Certificate</span>
                  </li>
                </ul>
              </div>

              {/* Student LRN Inputs */}
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Student LRN"
                      value={student.lrn}
                      onChange={(e) => handleStudentChange(student.id, e.target.value)}
                      className="h-14 rounded-full border-2 border-gray-900 bg-white px-6 text-lg placeholder:text-gray-500 flex-1"
                    />
                    {students.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeStudent(student.id)}
                        className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Another Student Button */}
              <Button
                onClick={addStudent}
                className="w-full h-12 rounded-lg bg-[#52a86a] hover:bg-[#449558] text-white font-semibold text-lg flex items-center justify-center gap-2"
              >
                Add another student
                <Plus className="h-5 w-5" />
              </Button>

              {/* File Upload Button */}
              <div>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="w-full h-12 rounded-lg bg-[#c4d433] hover:bg-[#b0c020] text-gray-900 font-semibold text-lg flex items-center justify-center gap-2"
                >
                  File Upload
                  <Plus className="h-5 w-5" />
                </Button>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="text-gray-900 font-medium">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end mt-8">
                <Button type="submit" className="h-14 px-12 rounded-full bg-[#52a86a] hover:bg-[#449558] text-white font-semibold text-xl">
                  Submit Registration
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

  )
}
