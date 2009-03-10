package org.plt.guiworld;

import javax.microedition.lcdui.*;
import javax.microedition.midlet.*;
import org.plt.world.WorldTransformer;

// GuiRenderer: creates the initial gui, given the world and the view.
// The visitor also keeps things up to date.

public class GuiRenderer {

	private String title;
	Form topForm;
	Object world;
	private Gui view;

	public GuiRenderer(String title, Object world, Gui view) {
		this.topForm = new Form(title);
		this.world = world;
		this.view = view;
		initializeForm();
	}

	// Returns the toplevel form.
	public Form getForm() {
		return topForm;
	}

	// Initialize the form contents.
	public void initializeForm() {
		this.view.accept(new InitialGuiConstructor(view));
	}

	// Changes the world, and updates the view accordingly.
	public void changeWorld(Object world) {
		this.world = world;
		this.view.accept(new GuiRefresher(0));
	}

	// ////////////////////////////////////////////////////////////////////

	private class InitialGuiConstructor implements GuiVisitor {
		private Gui gui;

		public InitialGuiConstructor(Gui gui) {
			this.gui = gui;
		}

		public void visit(Row r) {
			Gui[] items = r.getItems();
			for (int i = 0; i < items.length; i++) {
				items[i].accept(this);
			}
		}

		public void visit(Message m) {
			String msg = (m.getValF().transform(world)).toString();
			topForm.append(new StringItem("", msg));
		}

		// FIXME: implement these!

		public void visit(TextField t) {
			String msg = (t.getValF().transform(world)).toString();
			topForm.append(new javax.microedition.lcdui.TextField("", msg, 100,
					javax.microedition.lcdui.TextField.ANY));
		}

		public void visit(Col c) {
		}

		public void visit(BoxGroup b) {
		}

		public void visit(Canvas c) {
		}

		public void visit(final Button b) {
			String label = (b.getValF().transform(world)).toString();
			Command update = new Command(label, Command.OK, 1);
			topForm.addCommand(update);
			topForm.setCommandListener(new CommandListener() {
				public void commandAction(Command c, Displayable d) {
					Object newWorld = b.getCallback().transform(world);
					changeWorld(newWorld);
					topForm.removeCommand(c);
					visit(b);
				}
			});
		}

		public void visit(Slider s) {
		}

		public void visit(DropDown d) {
		}

		public void visit(CheckBox c) {
		}
	}

	private class GuiRefresher implements GuiVisitor {
		private int formIndex;

		public GuiRefresher(int formIndex) {
			this.formIndex = formIndex;
		}

		public void visit(Row r) {
			Gui[] items = r.getItems();
			for (int i = 0; i < items.length; i++) {
				items[i].accept(new GuiRefresher(this.formIndex + i));
			}
		}

		public void visit(Message m) {
			StringItem stringItem = (StringItem) topForm.get(this.formIndex);
			stringItem.setText(m.getValF().transform(world).toString());
		}

		// FIXME: implement these!
		public void visit(Col c) {
		}

		public void visit(BoxGroup b) {
		}

		public void visit(Canvas c) {
		}

		public void visit(Button b) {
		}

		public void visit(Slider s) {
		}

		public void visit(DropDown d) {
		}

		public void visit(TextField t) {
		}

		public void visit(CheckBox c) {
		}
	}

}