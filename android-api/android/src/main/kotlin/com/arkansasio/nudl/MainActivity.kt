package com.arkansasio.nudl

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.arkansasio.nudl.api.NudlRepository
import com.arkansasio.nudl.api.NudlServiceFactory
import com.arkansasio.nudl.api.NudlViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val repository = remember { NudlRepository(NudlServiceFactory.create()) }
            val vm: NudlViewModel = viewModel(factory = NudlViewModelFactory(repository))
            NUDLApp(vm)
        }
    }
}

@Composable
private fun NUDLApp(viewModel: NudlViewModel) {
    val state by viewModel.state.collectAsState()
    val scroll = rememberScrollState()

    MaterialTheme {
        Surface(modifier = Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(scroll)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text("NUDL Android API", style = MaterialTheme.typography.headlineSmall)
                Text("Noodle Unified Data Language mobile client")

                OutlinedTextField(
                    value = state.source,
                    onValueChange = viewModel::setSource,
                    modifier = Modifier.fillMaxWidth(),
                    minLines = 12,
                    label = { Text(state.filename) }
                )

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(onClick = viewModel::analyze, enabled = !state.running) { Text("Analyze") }
                    Button(onClick = viewModel::run, enabled = !state.running) { Text("Run") }
                    Button(onClick = { viewModel.generate("typescript") }, enabled = !state.running) { Text("Generate TS") }
                }

                if (state.running) Text("Processing…")

                state.diagnostics.forEach { diagnostic ->
                    Text("${diagnostic.severity}: ${diagnostic.message}")
                }

                state.generatedSource?.let { generated ->
                    Text("Generated source", style = MaterialTheme.typography.titleMedium)
                    Text(generated)
                }
            }
        }
    }
}

private class NudlViewModelFactory(
    private val repository: NudlRepository
) : androidx.lifecycle.ViewModelProvider.Factory {
    override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(NudlViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return NudlViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel: ${modelClass.name}")
    }
}
