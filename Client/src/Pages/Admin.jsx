import React from "react";
import api from "../services/webcalls";
import { useToast } from "../components/Toast";
import { LoadingSpinner, InlineSpinner } from "../components/LoadingSpinner";

const EMPTY_FORM = {
    name: "", email: "", password: "", phone: "", gender: "",
    speciality: "", pincode: "", address: "", hospital: ""
};

// The admin key is a bearer-less shared secret: a rejected/missing key always
// comes back with one of these messages (see requireAdminKey.js), so we can
// tell "wrong key" apart from an ordinary validation error and only bounce
// back to the gate screen in that specific case.
const isKeyRejection = (message) =>
    typeof message === "string" && (message.includes("admin key") || message.includes("ADMIN_API_KEY"));

export default function Admin(){
    const [unlocked,setUnlocked] = React.useState(api.admin.hasKey());
    const [keyInput,setKeyInput] = React.useState("");
    const [doctors,setDoctors] = React.useState([]);
    const [isLoadingDoctors,setIsLoadingDoctors] = React.useState(false);
    const [form,setForm] = React.useState(EMPTY_FORM);
    const [isSaving,setIsSaving] = React.useState(false);
    const { addToast } = useToast();

    const loadDoctors = React.useCallback(async ()=>{
        setIsLoadingDoctors(true);
        try{
            const data = await api.admin.getDoctors();
            setDoctors(data.doctors ?? data);
        }
        catch(error){
            addToast({ message: error.message || "Failed to load doctors.", type: "error" });
        }
        setIsLoadingDoctors(false);
    },[addToast]);

    React.useEffect(()=>{
        if(unlocked) loadDoctors();
    },[unlocked, loadDoctors]);

    function handleUnlock(event){
        event.preventDefault();
        if(!keyInput.trim()) return;
        api.admin.setKey(keyInput.trim());
        setUnlocked(true);
    }

    function handleLock(){
        api.admin.clearKey();
        setUnlocked(false);
        setDoctors([]);
        setKeyInput("");
    }

    function handleFormChange(event){
        const { name, value } = event.target;
        setForm(prev=>({ ...prev, [name]: value }));
    }

    async function handleCreateDoctor(event){
        event.preventDefault();
        setIsSaving(true);
        try{
            await api.admin.createDoctor(form);
            addToast({ message: `Dr. ${form.name} created successfully.`, type: "success" });
            setForm(EMPTY_FORM);
            loadDoctors();
        }
        catch(error){
            const message = error?.message || "Failed to create doctor.";
            addToast({ message, type: "error" });
            if(isKeyRejection(message)) handleLock();
        }
        setIsSaving(false);
    }

    async function handleDelete(doctorId, name){
        if(!window.confirm(`Delete Dr. ${name}? This cannot be undone.`)) return;
        try{
            await api.admin.deleteDoctor(doctorId);
            addToast({ message: `Dr. ${name} deleted.`, type: "success" });
            setDoctors(prev => prev.filter(d => d._id !== doctorId));
        }
        catch(error){
            const message = error?.message || "Failed to delete doctor.";
            addToast({ message, type: "error" });
            if(isKeyRejection(message)) handleLock();
        }
    }

    if(!unlocked){
        return (
            <div id="loginRoot">
                <form id="loginForm" onSubmit={handleUnlock}>
                    <h3 id="hello">Admin <span id="welcome">Access</span></h3>
                    <input
                        type="password"
                        placeholder="Admin key"
                        value={keyInput}
                        onChange={(e)=>setKeyInput(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" id="submitLogin">Unlock</button>
                </form>
            </div>
        );
    }

    return (
        <div style={{maxWidth:"900px", margin:"2rem auto", padding:"0 1rem"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <h2>Manage Doctors</h2>
                <button onClick={handleLock} style={{padding:"0.5rem 1rem", cursor:"pointer"}}>Lock</button>
            </div>

            <form onSubmit={handleCreateDoctor} style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem", margin:"1.5rem 0", padding:"1.5rem", border:"1px solid #ddd", borderRadius:"10px"}}>
                <h3 style={{gridColumn:"1 / -1", margin:0}}>Add a doctor</h3>
                <input name="name" placeholder="Name" value={form.name} onChange={handleFormChange} required/>
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleFormChange} required/>
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleFormChange} required/>
                <input name="phone" placeholder="Phone" value={form.phone} onChange={handleFormChange} required/>
                <select name="gender" value={form.gender} onChange={handleFormChange} required>
                    <option value="" disabled>Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <input name="speciality" placeholder="Speciality" value={form.speciality} onChange={handleFormChange}/>
                <input name="hospital" placeholder="Hospital" value={form.hospital} onChange={handleFormChange}/>
                <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleFormChange}/>
                <input name="address" placeholder="Address" value={form.address} onChange={handleFormChange} style={{gridColumn:"1 / -1"}}/>
                <button type="submit" disabled={isSaving} style={{gridColumn:"1 / -1", padding:"0.6rem", cursor:"pointer"}}>
                    {isSaving ? (<><InlineSpinner size="small"/> Creating...</>) : "Create doctor"}
                </button>
            </form>

            <h3>Existing doctors</h3>
            {isLoadingDoctors ? (
                <LoadingSpinner size="medium" text="Loading doctors..." />
            ) : doctors.length === 0 ? (
                <p>No doctors yet.</p>
            ) : (
                <table style={{width:"100%", borderCollapse:"collapse"}}>
                    <thead>
                        <tr>
                            <th style={{textAlign:"left", borderBottom:"1px solid #ddd", padding:"0.5rem"}}>Name</th>
                            <th style={{textAlign:"left", borderBottom:"1px solid #ddd", padding:"0.5rem"}}>Email</th>
                            <th style={{textAlign:"left", borderBottom:"1px solid #ddd", padding:"0.5rem"}}>Speciality</th>
                            <th style={{textAlign:"left", borderBottom:"1px solid #ddd", padding:"0.5rem"}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map(doc => (
                            <tr key={doc._id}>
                                <td style={{padding:"0.5rem", borderBottom:"1px solid #eee"}}>{doc.name}</td>
                                <td style={{padding:"0.5rem", borderBottom:"1px solid #eee"}}>{doc.email}</td>
                                <td style={{padding:"0.5rem", borderBottom:"1px solid #eee"}}>{doc.speciality || "—"}</td>
                                <td style={{padding:"0.5rem", borderBottom:"1px solid #eee"}}>
                                    <button onClick={()=>handleDelete(doc._id, doc.name)} style={{cursor:"pointer"}}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
