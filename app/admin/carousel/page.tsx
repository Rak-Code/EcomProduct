"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/firebase"
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore"

interface CarouselItem {
  id?: string
  title: string
  description: string
  cta: string
  link: string
  bgClass: string
  imageUrl: string
}

export default function AdminCarouselPage() {
  const [items, setItems] = useState<CarouselItem[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editItem, setEditItem] = useState<CarouselItem | null>(null)
  const [newItem, setNewItem] = useState<CarouselItem>({
    title: "",
    description: "",
    cta: "",
    link: "",
    bgClass: "",
    imageUrl: ""
  })

  useEffect(() => {
    // Load carousel items from Firestore
    async function fetchCarousel() {
      const snap = await getDocs(collection(db, "carousel"))
      setItems(snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }) as CarouselItem))
    }
    fetchCarousel()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value })
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editItem) return
    setEditItem({ ...editItem, [e.target.name]: e.target.value })
  }

  const handleEdit = (idx: number) => {
    setEditingIndex(idx)
    setEditItem(items[idx])
  }

  // Helper validation function
  const isValid = (item: CarouselItem) =>
    !!item.title && !!item.description && !!item.cta && !!item.link && !!item.bgClass && !!item.imageUrl;

  const handleSave = async () => {
    if (editingIndex === null || !editItem) return
    if (!isValid(editItem)) {
      alert("All fields are required!")
      return
    }
    const id = editItem.id || `slide${editingIndex}`
    await setDoc(doc(collection(db, "carousel"), id), editItem)
    const newItems = [...items]
    newItems[editingIndex] = { ...editItem, id }
    setItems(newItems)
    setEditingIndex(null)
    setEditItem(null)
  }

  const handleAdd = async () => {
    if (!isValid(newItem)) {
      alert("All fields are required!")
      return
    }
    const id = `slide${items.length}`
    await setDoc(doc(collection(db, "carousel"), id), newItem)
    setItems([...items, { ...newItem, id }])
    setNewItem({
      title: "",
      description: "",
      cta: "",
      link: "",
      bgClass: "",
      imageUrl: ""
    })
  }

  const handleRemove = async (idx: number) => {
    const id = items[idx].id
    if (id) await deleteDoc(doc(collection(db, "carousel"), id))
    const newItems = [...items]
    newItems.splice(idx, 1)
    setItems(newItems)
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Carousel Slides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="title" placeholder="Title" value={newItem.title} onChange={handleChange} />
              <Input name="description" placeholder="Description" value={newItem.description} onChange={handleChange} />
              <Input name="cta" placeholder="Button Text" value={newItem.cta} onChange={handleChange} />
              <Input name="link" placeholder="Button Link" value={newItem.link} onChange={handleChange} />
              <Input name="bgClass" placeholder="Background Class" value={newItem.bgClass} onChange={handleChange} />
              <Input name="imageUrl" placeholder="Image URL" value={newItem.imageUrl} onChange={handleChange} />
            </div>
            <Button onClick={handleAdd}>Add Slide</Button>
          </div>

          <div className="mt-8 space-y-4">
            {items.map((item, idx) => (
              <Card key={item.id || idx} className="border p-4 flex flex-col md:flex-row items-center gap-4">
                {editingIndex === idx && editItem ? (
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input name="title" placeholder="Title" value={editItem.title} onChange={handleEditChange} />
                    <Input name="description" placeholder="Description" value={editItem.description} onChange={handleEditChange} />
                    <Input name="cta" placeholder="Button Text" value={editItem.cta} onChange={handleEditChange} />
                    <Input name="link" placeholder="Button Link" value={editItem.link} onChange={handleEditChange} />
                    <Input name="bgClass" placeholder="Background Class" value={editItem.bgClass} onChange={handleEditChange} />
                    <Input name="imageUrl" placeholder="Image URL" value={editItem.imageUrl} onChange={handleEditChange} />
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="font-bold">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                    <div className="text-xs mt-1">Button: {item.cta} | Link: {item.link}</div>
                    <div className="text-xs">Background: {item.bgClass}</div>
                    <div className="text-xs">Image: {item.imageUrl}</div>
                  </div>
                )}
                {editingIndex === idx && editItem ? (
                  <Button onClick={handleSave}>Save</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => handleEdit(idx)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleRemove(idx)}>Remove</Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
