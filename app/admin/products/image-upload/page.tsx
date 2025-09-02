"use client"

import React, { useState, useEffect } from "react";
import { db } from "@/firebase"; 
import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Trash, Copy } from "lucide-react";

const CLOUDINARY_UPLOAD_PRESET = "unsigned_preset"; // Set to your actual unsigned preset name
const CLOUDINARY_CLOUD_NAME = "dbmv8xt5w"; // Your Cloudinary cloud name
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function ImageUploadPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch images from Firestore
  useEffect(() => {
    const q = query(collection(db, "products-images"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setImages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  }, []);

  // Handle image upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) {
      toast({ title: "Missing fields", description: "Please provide both name and image.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(CLOUDINARY_API_URL, { method: "POST", body: formData });
      const data = await res.json();
      if (!data.secure_url || !data.public_id) throw new Error("Cloudinary upload failed");
      await addDoc(collection(db, "products-images"), {
        name,
        imageUrl: data.secure_url,
        publicId: data.public_id,
        createdAt: new Date(),
      });
      toast({ title: "Image uploaded!" });
      setName("");
      setFile(null);
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  // Handle delete (calls Firebase Cloud Function API route)
  const handleDelete = async (img: any) => {
    if (!window.confirm(`Delete image '${img.name}'? This cannot be undone.`)) return;
    setDeleting(img.id);
    try {
      const res = await fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: img.publicId, docId: img.id }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Delete failed");
      toast({ title: "Image deleted" });
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  // Copy URL to clipboard
  const handleCopy = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast({ title: "Copied!", description: "Image URL copied to clipboard." });
    setTimeout(() => setCopiedId(null), 1200);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold text-pink-600 ">Image Upload & Management</h1>
        <Button asChild variant="outline" className="bg-pink-600 text-white hover:bg-pink-700 border border-pink-700 ml-4">
          <a href="/admin/products/new">← Back to Add Product</a>
        </Button>
      </div>
      <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 mb-8 items-end">
        <div>
          <label className="block mb-1 font-medium">Image Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter image name" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Select Image</label>
          <Input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} required />
        </div>
        <Button type="submit" disabled={uploading} className="min-w-[120px] bg-pink-600 text-white hover:bg-pink-70 border border-pink-700">
          {uploading ? <Loader2 className="animate-spin h-5 w-5" /> : "Upload"}
        </Button>
      </form>
      <div>
        <h2 className="text-lg font-semibold mb-4">Uploaded Images</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.length === 0 && <div className="text-muted-foreground">No images uploaded yet.</div>}
          {images.map(img => (
            <div key={img.id} className="border rounded-lg p-4 flex flex-col items-center">
              <img src={img.imageUrl} alt={img.name} className="h-32 w-32 object-cover rounded mb-2" />
              <div className="font-medium mb-1 w-full truncate" title={img.name}>{img.name}</div>
              <div className="text-xs text-muted-foreground mb-2 w-full truncate" title={img.imageUrl}>{img.imageUrl}</div>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(img.imageUrl, img.id)}
                  className={
                    copiedId === img.id
                      ? "border-green-500 bg-green-100 text-green-800"
                      : ""
                  }
                >
                  <Copy className="h-4 w-4 mr-1" />
                  {copiedId === img.id ? "Copied!" : "Copy URL"}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(img)} disabled={deleting === img.id}>
                  {deleting === img.id ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash className="h-4 w-4" />} Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
