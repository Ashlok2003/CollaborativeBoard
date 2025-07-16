import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Collaborative Board</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <Link
              size="lg"
              to="/signup"
              className={
                buttonVariants({
                  variant: 'secondary',
                })
              }
            >
              <span className="font-extrabold">Signup</span>
            </Link>
            <Link
              size="lg"
              to="/login"
              className={
                buttonVariants({
                  className: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg"
                })
              }
            >
              <span className="font-extrabold">Get Started</span>
            </Link>
          </div>
        </nav>
      </header>

      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 text-bold bg-blue-100 text-blue-700 hover:bg-blue-100">
            ✨ Real-time collaboration features
          </Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Organize Your Work with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Visual Kanban
            </span>
          </h1>
          <p className="text-sm font-semibold italic text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your productivity with our intuitive Kanban board platform. Visualize tasks, collaborate
            seamlessly, and achieve more with less effort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              size="lg"
              to="/login"
              className={
                buttonVariants({
                  className: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
                })
              }
            >
              <span className="font-extrabold">Get Started</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700">To Do</h3>
                    <Badge variant="secondary">3</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-800">Design landing page</p>
                      <p className="text-xs text-red-600 mt-1">High priority</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-yellow-800">User research</p>
                      <p className="text-xs text-yellow-600 mt-1">Medium priority</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700">In Progress</h3>
                    <Badge variant="secondary">2</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-800">API integration</p>
                      <p className="text-xs text-blue-600 mt-1">In development</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700">Done</h3>
                    <Badge variant="secondary">5</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-800">Database setup</p>
                      <p className="text-xs text-green-600 mt-1">Completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
