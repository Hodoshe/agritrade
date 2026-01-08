'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

const CATEGORIES = ['Livestock', 'Crops', 'Tools', 'Materials']
const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape'
]

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    is_negotiable: false,
    quantity: '',
    size_weight: '',
    health_status: '',
    province: '',
    delivery_option: '',
    contact_phone: '',
    contact_email: '',
    image_url: '',
  })

  useEffect(() => {
    loadProduct()
  }, [])

  const loadProduct = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (data) {
      setFormData({
        title: data.title,
        category: data.category,
        description: data.description,
        price: data.price.toString(),
        is_negotiable: data.is_negotiable,
        quantity: data.quantity.toString(),
        size_weight: data.size_weight || '',
        health_status: data.health_status || '',
        province: data.province,
        delivery_option: data.delivery_option,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        image_url: data.image_url || '',
      })
    } else {
      alert('Product not found or you do not have permission to edit it')
      router.push('/dashboard')
    }

    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let imageUrl = formData.image_url

      // Upload new image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)

        imageUrl = publicUrl
      }

      // Update product
      const { error: updateError } = await supabase
        .from('products')
        .update({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          price: parseFloat(formData.price),
          is_negotiable: formData.is_negotiable,
          quantity: parseInt(formData.quantity),
          size_weight: formData.size_weight,
          health_status: formData.health_status,
          province: formData.province,
          delivery_option: formData.delivery_option,
          contact_phone: formData.contact_phone,
          contact_email: formData.contact_email,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id)

      if (updateError) throw updateError

      alert('Product updated successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      alert('Error updating listing: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  if (loading
