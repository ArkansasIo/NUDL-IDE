package com.arkansasio.nudl.api

/**
 * File-backed persistence can be implemented with Android app-private storage.
 * The interface keeps filesystem details outside the NUDL compiler API layer.
 */
class NudlWorkspaceFileStore : NudlWorkspaceStore {
    private val workspaces = mutableMapOf<String, NudlWorkspace>()

    override suspend fun load(workspaceId: String): NudlWorkspace? = workspaces[workspaceId]

    override suspend fun save(workspace: NudlWorkspace) {
        workspaces[workspace.id] = workspace
    }

    override suspend fun delete(workspaceId: String) {
        workspaces.remove(workspaceId)
    }
}
