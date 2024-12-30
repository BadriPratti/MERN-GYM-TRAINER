import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';


// Interface for form data properties
interface FormData {
    name: string;
    gym: string;
    workoutType: string;
    timings: string;
    idealRate: string;
    userType: 'trainee' | 'trainer';
    onSignOut: () => void;
}

// Interface for trainer details
interface Trainee {
    id: number;
    name: string;
    gym: string;
    workoutType: string;
    timings: string;
    idealRate: string;
    email: string;
    phoneNumber: string;
}

const fetchTrainees = async (setTrainees: { (value: React.SetStateAction<Trainee[]>): void; (arg0: Trainee[]): void; }) => {
    try {
        const response = await fetch('http://localhost:5001/api/dash/trainees', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        });

        if (response.ok) {
        const data = await response.json();

        // Map the trainers to match the Trainer interface
        const formattedTrainees: Trainee[] = data.trainees.map((trainee: any) => ({
            id: trainee._id, // Map `_id` to `id`
            name: `${trainee.firstName} ${trainee.lastName}`,
            gym: trainee.locationPref,
            workoutType: trainee.workoutType,
            timings: trainee.timings,
            idealRate: trainee.idealRate,
            email: trainee.email,
            phoneNumber: trainee.phoneNumber,
        }));

        setTrainees(formattedTrainees); // Update state with formatted trainers
        } else {
        console.error('Error fetching trainees:', await response.json());
        }
    } catch (error) {
        console.error('Error fetching trainees:', error);
    }
};

const deleteUser = async (userData: Omit<FormData, 'onSignOut'>) => {
    const data = {
        name: userData.name,
    };
    // console.log("name: ", data);
    try{
        const response = await fetch('http://localhost:5001/api/users/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (response.ok){
            const data = await response.json();
            console.log('User deleted successfully:', data);
        } else {
            const error = await response.json();
            console.error('Error deleting user:', error);
        }
    } catch(error){
        console.error('Error deleting user:', error);
    }
};
// Function to get a random motivational quote
const getRandomQuote = () => {
    const quotes = [
        "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing or learning to do",
        "Success is walking from failure to failure with no loss of enthusiasm",
        "Success is not final, failure is not fatal: it is the courage to continue that counts",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
};

// Function to get a random workout tip
const getWorkoutTip = (gym: string, workoutType: string, timings: string, idealRate: string) => {
    let workoutTip = "";
  
    if (gym === "UCF RWC" && workoutType === "Bulk" && timings === "Morning (7AM-12PM)" && idealRate === "Basic ($10-$20)") {
      workoutTip = "Focus on compound exercises like squats, deadlifts, and bench press to build muscle mass.";
    } else if (gym === "UCF RWC" && workoutType === "Bulk" && timings === "Afternoon (12PM-5PM)" && idealRate === "Basic ($10-$20)") {
      workoutTip = "Incorporate progressive overload by increasing weight or reps to continue making gains.";
    } else if (gym === "UCF RWC" && workoutType === "Bulk" && timings === "Evening (5PM-10PM)" && idealRate === "Basic ($10-$20)") {
      workoutTip = "Make sure to warm up properly before your workout and cool down afterwards to prevent injury.";
    } else if (gym === "Planet Fitness" && workoutType === "Cut" && timings === "Morning (7AM-12PM)" && idealRate === "Premium ($20-$30)") {
      workoutTip = "Focus on high-intensity interval training (HIIT) to boost your metabolism and burn fat.";
    } else if (gym === "Planet Fitness" && workoutType === "Cut" && timings === "Afternoon (12PM-5PM)" && idealRate === "Premium ($20-$30)") {
      workoutTip = "Incorporate strength training exercises to build lean muscle and increase metabolism.";
    } else if (gym === "24 Hour Fitness" && workoutType === "Strength" && timings === "Morning (7AM-12PM)" && idealRate === "Ultra Premium ($30-$40)") {
      workoutTip = "Focus on functional exercises like squats, lunges, and step-ups to improve overall strength and athleticism.";
    } else {
      workoutTip = "Please consult a personal trainer for a customized workout plan.";
    }
  
    return workoutTip;
  };

const TrainerDash: React.FC<FormData> = ({ name, gym, workoutType, timings, idealRate, userType, onSignOut }) => {
    const navigate = useNavigate();
    const [quote, setQuote] = useState("");
    const [searchQuery, setSearchQuery] = useState('');
    const [filterGym, setFilterGym] = useState('');
    const [filterWorkoutType, setFilterWorkoutType] = useState('');
    const [filterTimings, setFilterTimings] = useState('');
    const [filterIdealRate, setFilterIdealRate] = useState('');
    const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [editableAccount, setEditableAccount] = useState({
        name,
        gym,
        workoutType,
        timings,
        idealRate,
        userType,
    });


    // Get the diet plan
    const workoutTip = getWorkoutTip(gym, workoutType, timings, idealRate);
    const [trainees, setTrainees] = useState<Trainee[]>([]);

    useEffect(() => {
        setQuote(getRandomQuote());
        fetchTrainees(setTrainees);
    }, []);

    // Handlers for search input and filter selection
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'gym') setFilterGym(value);
        else if (name === 'workoutType') setFilterWorkoutType(value);
        else if (name === 'timings') setFilterTimings(value);
        else if (name === 'idealRate') setFilterIdealRate(value);
    };

    // Handlers to open, close modals and update account information
    const handleTraineeClick = (trainee: Trainee) => {
        console.log("Selected trainee:", trainee);
        setSelectedTrainee(trainee);
    }
        
    const handleCloseModal = () => {
        setSelectedTrainee(null);
        setShowAccountModal(false);
    };
    const handleClearFilters = () => {
        setSearchQuery('');
        setFilterGym('');
        setFilterWorkoutType('');
        setFilterTimings('');
        setFilterIdealRate('');
    };
    const toggleAccountModal = () => setShowAccountModal(!showAccountModal);
    const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditableAccount((prev) => ({ ...prev, [name]: value }));
    };

    const deleteAccount = () => {
        console.log("Account Deleted:", editableAccount);
        // deleteUser(editableAccount);
        // onSignOut();
        navigate('/');
    }

    // Filter trainees based on search and filters
    const filteredTrainees = trainees.filter(trainee =>
        trainee.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterGym === '' || trainee.gym === filterGym) &&
        (filterWorkoutType === '' || trainee.workoutType === filterWorkoutType) &&
        (filterTimings === '' || trainee.timings === filterTimings) &&
        (filterIdealRate === '' || trainee.idealRate === filterIdealRate)
    );

    return (
        <div className="dashboard-container">
            {/* User icon and sign-out button */}
            <div className="user-icon" onClick={toggleAccountModal}>
                {name.charAt(0)}
            </div>
            <button className="sign-out-button" onClick={onSignOut}>Sign Out</button>

            {/* Welcome title and quote */}
            <div className="center-content">
                <h1 className="dashboard-title">Welcome, {name}!</h1>
                <p className="dashboard-quote">{quote}</p>

                {/* Filters and Calendar Panels */}
                <div className="content-layout">
                    <div className="left-panel">
                        <h2>Filter Trainees</h2>
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        <div className="filter-row">
                            <select name="gym" value={filterGym} onChange={handleFilterChange} className="filter-select">
                                <option value="">Select Gym</option>
                                <option value="UCF RWC">UCF RWC</option>
                                <option value="Planet Fitness">Planet Fitness</option>
                                <option value="24 Hour Fitness">24 Hour Fitness</option>
                            </select>
                            <select name="workoutType" value={filterWorkoutType} onChange={handleFilterChange} className="filter-select">
                                <option value="">Select Workout Type</option>
                                <option value="Cardio">Cardio</option>
          <option value="Calisthenics">Calisthenics</option>
          <option value="Powerlifting">Powerlifting</option>
          <option value="Bodybuilding">Bodybuilding</option>
          <option value="Crossfit">Crossfit</option>
                            </select>
                            <select name="timings" value={filterTimings} onChange={handleFilterChange} className="filter-select">
                                <option value="">Select Timings</option>
                                <option value="Morning (7AM-12PM)">Morning (7AM-12PM)</option>
                                <option value="Afternoon (12PM-5PM)">Afternoon (12PM-5PM)</option>
                                <option value="Evening (5PM-10PM)">Evening (5PM-10PM)</option>
                            </select>
                            <select name="idealRate" value={filterIdealRate} onChange={handleFilterChange} className="filter-select">
                                <option value="">Select Ideal Rate</option>
                                <option value="Basic ($10-$20)">Basic ($10-$20)</option>
                                <option value="Premium ($20-$30)">Premium ($20-$30)</option>
                                <option value="Ultra Premium ($30-$40)">Ultra Premium ($30-$40)</option>
                            </select>
                        </div>
                        <button className="clear-button" onClick={handleClearFilters}>Clear</button>
                        <ul className="trainer-list">
                            {filteredTrainees.map(trainee => (
                                <li
                                    key={trainee.id}
                                    className="trainer-name"
                                    onClick={() => handleTraineeClick(trainee)}
                                >
                                    {trainee.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                            
                    {/* Diet Plan Information */}
                    <div className="right-panel">
                        <h2>Workout Tips</h2>
                        <ul>
                            <li>{workoutTip}</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Account Information Modal */}
            {showAccountModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Account Information</h2>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" name="name" value={editableAccount.name} onChange={handleAccountChange} readOnly={true} />
                        </div>
                        <div className="form-group">
                            <label>Gym</label>
                            <select name="gym" value={editableAccount.gym} onChange={handleAccountChange}>
                                <option value="UCF RWC">UCF RWC</option>
                                <option value="Planet Fitness">Planet Fitness</option>
                                <option value="24 Hour Fitness">24 Hour Fitness</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Workout Type</label>
                            <select name="workoutType" value={editableAccount.workoutType} onChange={handleAccountChange}>
                                <option value="Bulk">Bulk</option>
                                <option value="Cut">Cut</option>
                                <option value="Strength">Strength</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Timings</label>
                            <select name="timings" value={editableAccount.timings} onChange={handleAccountChange}>
                                <option value="Morning (7AM-12PM)">Morning (7AM-12PM)</option>
                                <option value="Afternoon (12PM-5PM)">Afternoon (12PM-5PM)</option>
                                <option value="Evening (5PM-10PM)">Evening (5PM-10PM)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Ideal Rate</label>
                            <select name="idealRate" value={editableAccount.idealRate} onChange={handleAccountChange}>
                                <option value="Basic ($10-$20)">Basic ($10-$20)</option>
                                <option value="Premium ($20-$30)">Premium ($20-$30)</option>
                                <option value="Ultra Premium ($30-$40)">Ultra Premium ($30-$40)</option>
                            </select>
                        </div>
                        <button onClick={handleCloseModal} className="save-button">Save</button>
                        <button onClick={deleteAccount} className="delete-button">Delete Account</button>
                    </div>
                </div>
            )}

            {/* Trainee Contact Card Modal */}
            {selectedTrainee && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedTrainee.name}</h2>
                        <p><strong>Gym:</strong> {selectedTrainee.gym}</p>
                        <p><strong>Workout Type:</strong> {selectedTrainee.workoutType}</p>
                        <p><strong>Timings:</strong> {selectedTrainee.timings}</p>
                        <p><strong>Ideal Rate:</strong> {selectedTrainee.idealRate}</p>
                        <p><strong>Email:</strong> {selectedTrainee.email}</p>
                        <p><strong>Phone Number:</strong> {selectedTrainee.phoneNumber}</p>
                        <button onClick={handleCloseModal} className="save-button">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainerDash;
