# ChainRamp

ChainRamp allows project creators and businessess to manage whitelists for their projects, enabling token gated and prioirity access to their product offerings. 

ChainRamp leverages the Concordium's identity verification capabilities to ensures that users can only join a project within their region or meet the location and age criteria set by the project.

## Features

### Creating a Project
To create a project, use the `create_project` function and specify the project details. Only verified users can create projects, and each project is assigned a unique ID.

### Adding an Address to a Whitelist
To join a whitelist, call the `add_address_to_whitelist` function with the project ID. Ensure that the project exists, the whitelist is not full, and that you are not the creator or already whitelisted.

### Retrieving Whitelisted Addresses
Use the `get_whitelisted_addresses` function with the appropriate project ID to fetch the list of whitelisted addresses.

### Viewing Project Details
Call the `get_project_details` function with the project ID to view detailed information about a project, including its whitelist status and remaining spots.

### Listing All Projects
Use the `get_all_projects` function to retrieve information on all projects, including their names, descriptions, locations, and whitelist details.

## Links

- [Website](#) - Check out ChainRamp.
- [Demo Video](#) - Watch a quick demo of ChainRamp's features



## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
