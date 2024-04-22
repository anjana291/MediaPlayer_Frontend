import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import VideoCard from './VideoCard'
import { getAllCategoryApi, getUploadVideoApi, updateCategoryApi } from '../services/allAPI'
import Category from './Category'

function View({videoUploadStatus, setDragOutVideoStatus}) {
  //js code

  //state to hold the videos from backend
  const [video,setVideo] = useState([])

  const [deleteVideoStatus, setDeleteVideoStatus] = useState(false)

  const getVideo = async() => {
    const response=await getUploadVideoApi()
    // console.log(response.data);
    setVideo(response.data)
  }

  console.log(video);

  const dragOver = (e) =>{
    e.preventDefault()
  }

  const videoDrop = async(e) =>{
    const {categoryId, videoId} = JSON.parse(e.dataTransfer.getData("sharedData"))
    console.log(categoryId, videoId);
    // const {categoryId,videoId} = JSON.parse(e.dataTransfer.getData("sharedData")
    // console.log(categoryId,videoId);

    //to get all category from backend
    const {data} = await getAllCategoryApi()
    console.log(data);

    //to get category with same categoryId 
    let selectedCategory = data.find((item)=>item.id==categoryId)
    let result = selectedCategory.allVideo.filter((item)=>item.id!=videoId)

    let reqBody = {
      category : selectedCategory.category,
      allVideo : result,
      id : categoryId
    }
  //update the category api at backend
  await updateCategoryApi(categoryId,reqBody)
  setDragOutVideoStatus(true)


}


  useEffect(()=>{
    getVideo()
    setDeleteVideoStatus(false)
  },[videoUploadStatus,deleteVideoStatus])


  return (
    <>
    <Row droppable = "true" onDragOver={(e)=>dragOver(e)} onDrop={(e)=>videoDrop(e)}>
       {video?.length>0 ?   //checks length of video: if length is empty h5 is displayed and if lenght>0 each item is displayed,? is for checking content after the page loads bcoz it is asynchronous
       video?.map((item)=>(
       <Col sm={12} md={6} lg={4} xl={3}>
            <VideoCard displayVideo={item} setDeleteVideoStatus={setDeleteVideoStatus}/>
        </Col>
       ))

        :

        <h5 className='mt-5 text-warning'>No Video Uploaded Yet...</h5>}
    </Row>        
    </>
  )
}

export default View