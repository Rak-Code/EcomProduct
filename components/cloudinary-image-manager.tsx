"use client"

import { useState, useEffect } from "react"
import { db } from "@/firebase"
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore"
import { Button } from "@/components/ui/button"

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/djvsxfmqy/upload"
const CLOUDINARY_UPLOAD_PRESET = "unsigned_preset"

interface ImageDoc {
  id: string
  name: string
  url: string
  public_id: string
}

export default function CloudinaryImageManager() {
  const [file, setFile] = useState<File | null>(null)
  const [imageName, setImageName] = useState("")
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<ImageDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  // Fetch images from Firestore
  useEffect(() => {
    async function fetchImages() {
      setLoading(true)
      const snap = await getDocs(collection(db, "images"))
      setImages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ImageDoc)))
      setLoading(false)
    }
    fetchImages()
  }, [])

  // Handle image upload
  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !imageName) {
      setToast("Please select a file and enter a name.")
      return
    }
    setUploading(true)
    setToast(null)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
    try {
      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!data.secure_url || !data.public_id) throw new Error("Upload failed")
      // Save metadata to Firestore
      await addDoc(collection(db, "images"), {
        name: imageName,
        url: data.secure_url,
        public_id: data.public_id,
      })
      setToast("Image uploaded successfully!")
      setFile(null)
      setImageName("")
      // Refresh list
      const snap = await getDocs(collection(db, "images"))
      setImages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ImageDoc)))
    } catch (err) {
      setToast("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  // Handle delete
  async function handleDelete(image: ImageDoc) {
    if (!confirm("Are you sure you want to delete this image?")) return
    setToast(null)
    try {
      // Call Firebase Function to delete from Cloudinary
      await fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: image.public_id, docId: image.id }),
      })
      // Remove from Firestore
      await deleteDoc(doc(db, "images", image.id))
      setToast("Image deleted successfully!")
      setImages(images.filter(img => img.id !== image.id))
    } catch (err) {
      setToast("Delete failed. Please try again.")
    }
  }

  // Copy URL to clipboard
  function handleCopy(url: string) {
    navigator.clipboard.writeText(url)
    setToast("Copied URL to clipboard!")
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Cloudinary Image Manager</h2>
      <form onSubmit={handleUpload} className="mb-8 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Image Name"
          value={imageName}
          onChange={e => setImageName(e.target.value)}
          className="border px-2 py-1 rounded"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="border px-2 py-1 rounded"
          required
        />
        <Button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Image"}
        </Button>
      </form>
      {toast && <div className="mb-4 text-center text-sm text-green-600">{toast}</div>}
      <hr className="my-6" />
      <h3 className="text-xl font-semibold mb-4">Uploaded Images</h3>
      {loading ? (
        <div>Loading images...</div>
      ) : images.length === 0 ? (
        <div>No images uploaded yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {images.map(image => (
            <div key={image.id} className="border rounded-lg p-4 flex flex-col items-center">
              <img src={image.url} alt={image.name} className="w-32 h-32 object-cover rounded mb-2" />
              <div className="font-semibold mb-1">{image.name}</div>
              <div className="text-xs mb-2 break-all">{image.url}</div>
              <div className="flex gap-2">
                <Button type="button" onClick={() => handleCopy(image.url)} size="sm">Copy URL</Button>
                <Button type="button" onClick={() => handleDelete(image)} size="sm" variant="destructive">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
