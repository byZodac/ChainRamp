use concordium_std::*;
use core::fmt::Debug;

// Structs

#[derive(Serialize, SchemaType, Clone)]
struct Project {
    name: String,
    description: String,
    location: String,
    max_whitelisted_addresses: u64,
    num_addresses_whitelisted: u64,
    creator: Address,  // Changed from AccountAddress to Address
}

#[derive(Serialize, SchemaType, Clone)]
struct ProjectInfo {
    project_id: u64,
    name: String,
    description: String,
    location: String,
    max_whitelisted_addresses: u64,
    num_addresses_whitelisted: u64,
    creator: Address,  
    whitelisted_addresses: Vec<Address>, 
    remaining_whitelist_spots: u64,
    is_whitelist_closed: bool,
}

// Contract State

#[derive(Serial, DeserialWithState)]
#[concordium(state_parameter = "S")]
struct State<S: HasStateApi> {
    projects: StateMap<u64, Project, S>,
    project_count: u64,
    whitelists: StateMap<u64, Vec<Address>, S>,  
}

impl<S: HasStateApi> State<S> {
    fn new(state_builder: &mut StateBuilder<S>) -> Self {
        State {
            projects: state_builder.new_map(),
            project_count: 0,
            whitelists: state_builder.new_map(),
        }
    }
}

// Contract Functions

#[init(contract = "project_whitelist")]
fn init<S: HasStateApi>(
    _ctx: &InitContext,
    state_builder: &mut StateBuilder<S>,
) -> InitResult<State<S>> {
    Ok(State::new(state_builder))
}

#[receive(contract = "project_whitelist", name = "create_project", parameter = "CreateProjectParams", mutable)]
fn create_project<S: HasStateApi>(
    ctx: &ReceiveContext,
    host: &mut impl HasHost<State<S>>,
) -> Result<(), CustomContractError> {
    let params: CreateProjectParams = ctx.parameter_cursor().get().map_err(|_| CustomContractError::ParseError)?;
    let state = host.state_mut();

    state.project_count += 1;
    let project_id = state.project_count;

    let project = Project {
        name: params.name,
        description: params.description,
        location: params.location,
        max_whitelisted_addresses: params.max_whitelisted_addresses,
        num_addresses_whitelisted: 0,
        creator: ctx.sender(),
    };

    state.projects.insert(project_id, project);
    state.whitelists.insert(project_id, Vec::new());

    Ok(())
}

#[receive(contract = "project_whitelist", name = "add_address_to_whitelist", parameter = "AddToWhitelistParams", mutable)]
fn add_address_to_whitelist<S: HasStateApi>(
    ctx: &impl HasReceiveContext,
    host: &mut impl HasHost<State<S>>,
) -> Result<(), CustomContractError> {
    let params: AddToWhitelistParams = ctx.parameter_cursor().get().map_err(|_| CustomContractError::ParseError)?;
    let state = host.state_mut();

    // Ensure the project exists and make it mutable
     // Ensure the project exists and make it mutable
    let project = state.projects.get_mut(&params.project_id).ok_or(CustomContractError::ProjectNotFound)?;

    // Ensure the sender is not the creator and that the whitelist is not full
    ensure!(ctx.sender() != project.creator, CustomContractError::CreatorCannotJoin);
    ensure!(project.num_addresses_whitelisted < project.max_whitelisted_addresses, CustomContractError::WhitelistClosed);

    // Get the whitelist, make it mutable, and ensure the sender is not already whitelisted
    let whitelist = state.whitelists.get_mut(&params.project_id).ok_or(CustomContractError::WhitelistNotFound)?;
    let whitelist = whitelist.as_mut();
    ensure!(!whitelist.contains(&ctx.sender()), CustomContractError::AlreadyWhitelisted);

    // Add the sender to the whitelist and update the project
    whitelist.push(ctx.sender());
    project.num_addresses_whitelisted += 1;

    Ok(())
}


#[receive(contract = "project_whitelist", name = "get_whitelisted_addresses", parameter = "GetWhitelistParams", return_value = "Vec<Address>")]
fn get_whitelisted_addresses<S: HasStateApi>(
    ctx: &impl HasReceiveContext,
    host: &impl HasHost<State<S>>,
) -> Result<Vec<Address>, CustomContractError> {
    let params: GetWhitelistParams = ctx.parameter_cursor().get().map_err(|_| CustomContractError::ParseError)?;
    let state = host.state();

    // Retrieve the whitelist and return it
    let whitelist = state.whitelists.get(&params.project_id).ok_or(CustomContractError::WhitelistNotFound)?;
    Ok(whitelist.clone())
}

#[receive(contract = "project_whitelist", name = "get_project_details", parameter = "GetProjectParams", return_value = "ProjectInfo")]
fn get_project_details<S: HasStateApi>(
    ctx: &impl HasReceiveContext,
    host: &impl HasHost<State<S>>,
) -> Result<ProjectInfo, CustomContractError> {
    let params: GetProjectParams = ctx.parameter_cursor().get().map_err(|_| CustomContractError::ParseError)?;
    let state = host.state();

    // Retrieve project and whitelist, then construct the project info
    let project = state.projects.get(&params.project_id).ok_or(CustomContractError::ProjectNotFound)?;
    let whitelist = state.whitelists.get(&params.project_id).ok_or(CustomContractError::WhitelistNotFound)?;

    let remaining_spots = project.max_whitelisted_addresses - project.num_addresses_whitelisted;
    let is_whitelist_closed = remaining_spots == 0;

    Ok(ProjectInfo {
        project_id: params.project_id,
        name: project.name.clone(),
        description: project.description.clone(),
        location: project.location.clone(),
        max_whitelisted_addresses: project.max_whitelisted_addresses,
        num_addresses_whitelisted: project.num_addresses_whitelisted,
        creator: project.creator,
        whitelisted_addresses: whitelist.clone(),
        remaining_whitelist_spots: remaining_spots,
        is_whitelist_closed,
    })
}

#[receive(contract = "project_whitelist", name = "get_all_projects", return_value = "Vec<ProjectInfo>")]
fn get_all_projects<S: HasStateApi>(
    _ctx: &impl HasReceiveContext,
    host: &impl HasHost<State<S>>,
) -> Result<Vec<ProjectInfo>, CustomContractError> {
    let state = host.state();
    let mut all_projects = Vec::new();

    // Iterate through all projects and collect their details
    for (project_id, project) in state.projects.iter() {
        let whitelist = state.whitelists.get(project_id).ok_or(CustomContractError::WhitelistNotFound)?;
        let remaining_spots = project.max_whitelisted_addresses - project.num_addresses_whitelisted;
        let is_whitelist_closed = remaining_spots == 0;

        all_projects.push(ProjectInfo {
            project_id: *project_id,
            name: project.name.clone(),
            description: project.description.clone(),
            location: project.location.clone(),
            max_whitelisted_addresses: project.max_whitelisted_addresses,
            num_addresses_whitelisted: project.num_addresses_whitelisted,
            creator: project.creator,
            whitelisted_addresses: whitelist.clone(),
            remaining_whitelist_spots: remaining_spots,
            is_whitelist_closed,
        });
    }

    Ok(all_projects)
}

// Parameter types

#[derive(Serialize, SchemaType)]
struct CreateProjectParams {
    name: String,
    description: String,
    location: String,
    max_whitelisted_addresses: u64,
}

#[derive(Serialize, SchemaType)]
struct AddToWhitelistParams {
    project_id: u64,
}

#[derive(Serialize, SchemaType)]
struct GetWhitelistParams {
    project_id: u64,
}

#[derive(Serialize, SchemaType)]
struct GetProjectParams {
    project_id: u64,
}

// Custom error type

#[derive(Debug, PartialEq, Eq, Reject, Serialize, SchemaType)]
enum CustomContractError {
    ParseError,
    ProjectNotFound,
    WhitelistNotFound,
    CreatorCannotJoin,
    AlreadyWhitelisted,
    WhitelistClosed,
    Unauthorized,
}