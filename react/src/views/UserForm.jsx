import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axiosClient";

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: null,
    name: "",
    prenom: "",
    email: "",
    password: "",
    role: "CITOYEN",
    telephone: "",
    age: "",
    genre: "FEMME",
    photo: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/users/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setUser(data);
        })
        .catch((error) => {
          setLoading(false);
          console.error(error);
        });
    }
  }, [id]);

  const onSubmit = (ev) => {
    ev.preventDefault();
    const formData = new FormData();
    for (const key in user) {
      formData.append(key, user[key]);
    }
    console.log('Form data:', formData);

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };

    if (user.id) {
      axiosClient.put(`/users/${user.id}`, formData, config)
        .then(() => {
          navigate("/users");
        })
        .catch((error) => {
          if (error.response && error.response.status === 422) {
            setErrors(error.response.data.errors);
          } else {
            console.error(error);
          }
        });
    } else {
      axiosClient.post("/users", formData, config)
        .then(() => {
          navigate("/users");
        })
        .catch((error) => {
          if (error.response) {
            console.log('Error response:', error.response);
          }
          if (error.response && error.response.status === 422) {
            setErrors(error.response.data.errors);
          } else {
            console.error(error);
          }
        });
    }
  };

  const handleInputChange = (ev) => {
    const { name, value } = ev.target;
    setUser({ ...user, [name]: value });
  };

  const handleFileChange = (ev) => {
    setUser({ ...user, photo: ev.target.files[0] });
  };

  return (
    <>
      {user.id ? <h1>Update User: {user.name}</h1> : <h1>New User</h1>}
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">Loading...</div>
        )}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
            <input
              value={user.name}
              onChange={handleInputChange}
              name="name"
              placeholder="Name"
            />
             <input
              value={user.prenom}
              onChange={handleInputChange}
              name="prenom"
              placeholder="prenom"
            />
            <input
              value={user.email}
              onChange={handleInputChange}
              name="email"
              placeholder="Email"
            />
            <input
              type="password"
              onChange={handleInputChange}
              name="password"
              placeholder="Password"
            />
            <select
              value={user.role}
              onChange={handleInputChange}
              name="role"
              className="custom-select"
            >
                <option value="" disabled selected></option>

              <option value="CITOYEN">CITOYEN</option>
              <option value="ADMINISTRATEUR">ADMINISTRATEUR</option>
              <option value="AGENT">AGENT</option>
            </select>
            <input
              value={user.telephone}
              onChange={handleInputChange}
              name="telephone"
              type="number"
              placeholder="Téléphone"
              style={{ marginTop: '15px' }}
            />
            <input
              value={user.age}
              onChange={handleInputChange}
              name="age"
              type="number"
              placeholder="Age"
            />
            <select
              value={user.genre}
              onChange={handleInputChange}
              name="genre"
              className="custom-select"
            >
              <option value="" disabled selected>Sélectionner un genre</option>

              <option value="FEMME">FEMME</option>
              <option value="HOMME">HOMME</option>
            </select>
            <input
              onChange={handleFileChange}
              type="file"
              className="custom-file-input"
            />
            <button className="btn btn-block">Save</button>
            <p className="message">
              Vous avez déjà un compte? <Link to='/login'>connexion</Link>
            </p>
          </form>
        )}
      </div>
    </>
  );
}
