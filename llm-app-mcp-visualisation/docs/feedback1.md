# Feedback

## Orchestration layer

- You need to fix how the message list object is prepared. Add all the past messages also in the message history in the correct order before making every subsequent API call

## LLM chat UI

- For templated prompts like the “find name in hellos” tool, you need to create some UI element to take input for the parameter {name}
- The + button drop down list should close if the user clicks anywhere outside the drop down list also. Currently it only closes if I press the + button again
- Remove the initial text boxes which say “user input text” and “Response or output text”. That was just for you to understand the wireframe.
- There is no scroll in the chat UI.
    - Currently It starts off as a small component and slowly grows and extends the bounds of the containing UI element
    - Instead it should start off almost as tall as the parent component and as new messages are added and history grows beyond what can be contained in the chat, then a scroll bar appears inside that component. Just like a normal chat application UI.
- Update the look and feel of this component to feel like a normal chat UI of web app

## LLM API input/output

- Clean up the visualisation of field values. Its not clear that the left aligned text is field name and description and the right aligned text is the value.
- Use your judgment to make this look better, clear and readable
- Tools field - expand to show the tools that are being sent to the LLM
- Open the pop up at the bottom of the scroll so that the latest calls can be seen
- Add some text “Timestamp” next to the timestamp so that it is clear what it is
- Add the system activity log step number also next to the time stamp for each API call and response
- I see some cases of “complex output” in this, can you just show the full output here instead ?

## System activity log

- Add log for the orchestration layer calling the fetching list of tools list, prompts and resources
- Make sure the visual always remains at the bottom of the scroll as new items are added so that the user can always see the latest logs

## Overall visual clean up

- You have tried to match the colours and visual aesthetic of the wireframe but I want the app to look like a sleek modern web app
- Modify the UI and styles to achieve a professional look