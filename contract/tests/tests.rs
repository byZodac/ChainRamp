use concordium_smart_contract_testing::*;
use chain_ramp_contract::*;

#[concordium_cfg_test]
mod tests {
    use super::*;
    use test_infrastructure::*;

    #[concordium_test]
    fn test_init() {
        let ctx = InitContextTest::empty();
        let mut state_builder = TestStateBuilder::new();

        let state_result = init(&ctx, &mut state_builder);
        let state = state_result.expect("Contract initialization failed");

        assert_eq!(state.project_count, 0, "Initial project count should be 0");
    }

    #[concordium_test]
    fn test_create_project() {
        let ctx = InitContextTest::empty();
        let mut state_builder = TestStateBuilder::new();
        let mut host = TestHost::new(State::new(&mut state_builder), state_builder);

        let create_params = CreateProjectParams {
            name: "Test Project".to_string(),
            description: "A test project".to_string(),
            location: "Test Location".to_string(),
            max_whitelisted_addresses: 10,
        };

        let create_ctx = TestReceiveContext::empty()
            .with_parameter(&create_params)
            .with_sender(AccountAddress([0u8; 32]));

        create_project(&create_ctx, &mut host).expect("Project creation failed");

        let state = host.state();
        assert_eq!(state.project_count, 1, "Project count should be 1");
        assert!(state.projects.get(&1).is_some(), "Project should exist");
        assert!(state.whitelists.get(&1).is_some(), "Whitelist should exist");
    }

}