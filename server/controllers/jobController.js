import Job from "../models/Jobs.js"



// get all jobs 
export const getJobs = async(req, res) => {
    try {
        
        const jobs = await Job.find({visible: true})
        //populate removes password property from company data
        .populate({path: 'companyId', select:'-password'})

        res.json({success: true, jobs})

    } catch (error) {
        res.json({success:false, message: error.message})
    }
}

//get a single job by id
export const getJobById = async(req, res) => {
    try {
        
        const {id} = req.params

        const job = await Job.findById(id)
        .populate({
            path:'companyId',
            select: '-password'
        })
        if (!job) {
            return res.json({success:false, message: 'job not found'})
        }

        res.json({success:true, job})
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}