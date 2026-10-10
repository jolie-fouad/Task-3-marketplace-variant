import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

// Build the Sell an Item page (see README.md "Your task").
// Routed at /listings/new (sell) and /listings/:id (edit), both inside <ProtectedRoute>.

const defaults = { title: '', description: '', price: 0, category: 'other', condition: 'used', status: 'active' }

// Allowed values: must match the server exactly, or it rejects the request
const categories = ['textbooks', 'electronics', 'furniture', 'clothing', 'other']
const conditions = ['new', 'like-new', 'used', 'worn']
const statuses = ['active', 'sold']

export default function ListingForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  // TODO (edit mode): when there is an `id`, load the listing and fill the form.
  useEffect(() => {
    if (!id) return
    // TODO
  }, [id])

  // One handler for every input: the input's `name` says which field to update
  function onChange(e) {
    const { name, value, type } = e.target
    // Number inputs give a string ("25"), so convert it; keep '' so the field can be cleared
    const newValue = type === 'number' && value !== '' ? Number(value) : value
    setForm(prev => ({ ...prev, [name]: newValue }))
  }

  // TODO: POST a new listing, or PATCH the existing one when editing,
  // then go back to /listings. Show the server's error message on failure.
  // Send the form to the server, then go back to the listings page
  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await api.post('/listings', form)
      nav('/listings')
    } catch (err) {
      // Show the server's message (e.g. 400 for a negative price)
      setError(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">{id ? 'Edit' : 'New'} Listing</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <span className="text-sm font-medium">Title</span>
          <input className="input" name="title" type="text" placeholder="e.g. Calculus textbook"
            value={form.title} onChange={onChange} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Price</span>
          <input className="input" name="price" type="number" step="any"
            value={form.price} onChange={onChange} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Category</span>
          <select className="input" name="category" value={form.category} onChange={onChange}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Condition</span>
          <select className="input" name="condition" value={form.condition} onChange={onChange}>
            {conditions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        {id && (
          <label className="block">
            <span className="text-sm font-medium">Status</span>
            <select className="input" name="status" value={form.status} onChange={onChange}>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        )}

        <label className="block">
          <span className="text-sm font-medium">Description</span>
          <textarea className="input" name="description" rows={4} placeholder="Optional"
            value={form.description} onChange={onChange} />
        </label>


        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="btn" type="submit">Save</button>
      </form>
    </div>
  )
}