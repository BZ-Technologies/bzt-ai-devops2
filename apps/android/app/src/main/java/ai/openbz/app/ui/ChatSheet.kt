package ai.openbz.app.ui

import androidx.compose.runtime.Composable
import ai.openbz.app.MainViewModel
import ai.openbz.app.ui.chat.ChatSheetContent

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  ChatSheetContent(viewModel = viewModel)
}
