import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

function EmployeeManagementPage() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        // Simulate a network request
        axios.get('/api/employees')
            .then(response => {
                setEmployees(response.data);
            })
            .catch(error => {
                console.error('Error fetching employees:', error);
            });
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Employee Management
            </Typography>
            <Button variant="contained" color="primary" style={{ marginBottom: '20px' }}>
                Add Employee
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell>{employee.name}</TableCell>
                                <TableCell>{employee.role}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="primary" style={{ marginRight: '10px' }}>
                                        Edit
                                    </Button>
                                    <Button variant="outlined" color="secondary">
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default EmployeeManagementPage; 