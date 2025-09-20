// components/MaterialPicker.jsx
"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X } from "lucide-react"

export default function MaterialPicker() {
  const [image, setImage] = useState(null)
  const [pickedColor, setPickedColor] = useState(null)
  const canvasRef = useRef(null)

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle color picking on click
  const handlePickColor = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const pixel = ctx.getImageData(x, y, 1, 1).data
    setPickedColor(`rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`)
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="flex flex-col items-center gap-4 p-6">
        {image ? (
          <div className="relative w-full">
            <canvas
              ref={canvasRef}
              className="rounded-lg border"
              width={400}
              height={300}
              onClick={handlePickColor}
            />
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={() => { setImage(null); setPickedColor(null) }}
            >
              <X className="h-4 w-4" />
            </Button>
            {pickedColor && (
              <div
                className="mt-2 w-16 h-16 rounded border"
                style={{ backgroundColor: pickedColor }}
              >
              </div>
            )}
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted transition">
            <Upload className="h-6 w-6 mb-2 opacity-70" />
            <span className="text-sm text-muted-foreground">Click to upload an image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </CardContent>

      {/* Draw uploaded image to canvas */}
      {image && (
        <img
          src={image}
          alt="hidden"
          style={{ display: "none" }}
          ref={(img) => {
            if (img && canvasRef.current) {
              const ctx = canvasRef.current.getContext("2d")
              ctx.clearRect(0, 0, 400, 300)
              ctx.drawImage(img, 0, 0, 400, 300)
            }
          }}
        />
      )}
    </Card>
  )
}
