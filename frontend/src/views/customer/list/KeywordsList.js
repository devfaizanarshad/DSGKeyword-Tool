/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const KeywordsList = () => {
    const { id } = useParams();
    const [customers, setCustomers] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [filteredCustomer, setfilteredCustomer] = useState([]); // Initialize with an empty array
    const perPage = 25;

    const fetchKeywords = async () => {
        console.log("Hit APi");
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/customer/listOfKeywords/${id}`);
            if (Array.isArray(response.data.data)) {
                setCustomers(response.data.data);
                setCustomerName(response.data.dataName);
                setCustomerEmail(response.data.dataEmail);
                setfilteredCustomer(response.data.data);
            } else {
                console.error("API response is not an array:", response.data.data);
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };
    useEffect(() => {
        fetchKeywords();
    });

    const handleFilter = (e) => {
        const searchText = e.target.value.toLowerCase();

        if (searchText.trim() === '') {
            setfilteredCustomer(customers); // Reset filtered data to all data
        } else {
            const filteredData = customers.filter((item) =>
                Object.values(item).some((value) =>
                    String(value).toLowerCase().includes(searchText)
                )
            );
            setfilteredCustomer(filteredData);
        }

        setCurrentPage(0);
    };

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    // Calculate the start and end index for the current page
    const startIndex = currentPage * perPage;
    const endIndex = startIndex + perPage;

    // Slice the category array to display items for the current page
    // const displayedCategory = category.slice(startIndex, endIndex);
    const displayedCustomers = customers.slice(startIndex, endIndex);

    const handleDelete = (keywordId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this keyword permanently.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${process.env.REACT_APP_API_BASE_URL}/customer/deleteKeyword/?customerId=${id}&keywordId=${keywordId}`)
                    .then((response) => {
                        if (response.status === 200) {
                            setCustomers((prevCustomers) => prevCustomers.filter((element) => element._id !== id))
                            setfilteredCustomer((prevCustomers) => prevCustomers.filter((element) => element._id !== id));
                        } else {
                            Swal.fire('Error!', 'Keyword deletion failed.', 'error');
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        Swal.fire('Error!', 'Keyword deletion failed.', 'error');
                    });
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <div className="customer-info-header border-b border-gray-300 mb-3">
                        <h1 className="text-xl font-bold text-indigo-700">Keywords List</h1>
                        <div className="customer-info-details flex items-center gap-4 mt-2">
                            <div className="customer-info-field">
                                <label className="font-bold">Name:</label>
                                <span className="text-lg text-gray-900 mx-2">{customerName}</span>
                            </div>
                            <div className="customer-info-field">
                                <label className="font-bold">Email:</label>
                                <span className="text-lg mx-2 text-gray-900">{customerEmail}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            placeholder="Search Results"
                            onChange={handleFilter}
                            className="form-control rounded-pill w-76 h-8"
                        />
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr className="bg-[#4B0082] text-white">
                            <th className="text-center" style={{ width: "5%", color: "white", backgroundColor: "#4B0082", transition: 'background-color 0.3s, color 0.3s' }} onMouseEnter={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = '#4B0082'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#4B0082'; e.target.style.color = 'white'; }}>Sr#</th>
                            <th className="text-center" style={{ width: "20%", color: "white", backgroundColor: "#4B0082", transition: 'background-color 0.3s, color 0.3s' }} onMouseEnter={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = '#4B0082'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#4B0082'; e.target.style.color = 'white'; }}>Keywords</th>
                            <th className="text-center" style={{ width: "67%", color: "white", backgroundColor: "#4B0082", transition: 'background-color 0.3s, color 0.3s' }} onMouseEnter={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = '#4B0082'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#4B0082'; e.target.style.color = 'white'; }}>Links</th>
                            <th className="text-center" style={{ width: "8%", color: "white", backgroundColor: "#4B0082", transition: 'background-color 0.3s, color 0.3s' }} onMouseEnter={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = '#4B0082'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#4B0082'; e.target.style.color = 'white'; }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedCustomers && displayedCustomers.map((element, index) => (
                            <tr key={element._id}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">
                                    {element.keyword}
                                </td>
                                <td className="text-center">
                                    {element.link}
                                </td>
                                <td className="text-center">
                                    <span
                                        onClick={() => handleDelete(element._id)}>
                                        <FontAwesomeIcon icon={faTrash} className="cursor-pointer text-red-600 text-lg mx-1" />
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="text-center">
                <ReactPaginate
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    pageCount={Math.ceil(customers.length / perPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageChange}
                    containerClassName={'pagination justify-content-center'}
                    activeClassName={'active'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-item'}
                    nextClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextLinkClassName={'page-link'}
                    breakClassName={'page-item'}
                    breakLinkClassName={'page-link'}
                />
            </div>
        </div>
    );
};

export default KeywordsList;