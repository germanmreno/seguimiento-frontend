import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { ImageCarousel } from "../components/custom"
import { Layout } from "../layout/layout"

export const MainPage = () => {

  const navigate = useNavigate()

  return (

    <Layout>
      <ImageCarousel />

      <div className="flex space-x-16 justify-center items-center w-full mt-12 ">
        <Button disabled variant="outline" className="flex flex-col h-36 w-52 rounded-lg p-1 button-gradient shadow-xl">
          <img src="/button_forums.png" alt="registro" className="h-[80px]" />
          <h1 className="primary-text text-lg mb-2">Foros</h1>
        </Button>
        <Button variant="outline" className="flex flex-col h-36 w-52 rounded-lg p-1 button-gradient shadow-xl" onClick={() => navigate("/memos")}>
          <img src="/button_add.png" alt="registro" className="h-[80px]" />
          <h2 className="primary-text text-lg mb-2">Oficios</h2>
        </Button>
      </div>

    </Layout>

  )
}
