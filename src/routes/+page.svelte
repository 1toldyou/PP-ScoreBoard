<svelte:head>
	<title>PowerPlay Scoreboard</title>
	<meta name="description" content="better score-board for PowerPlay2022" />
</svelte:head>

<script lang="ts">
	import structuredClone from "@ungap/structured-clone";

	import type {ConeAction} from "$lib/cone-action";
	import type {Pole} from "$lib/pole";
	import {PoleHeight} from "$lib/pole";
	import {Alliance, ConeType} from "$lib/cone";

	const originalJunctions: Pole[][] = [
		[
			{height: PoleHeight.GROUND, xCoordinate: 0, yCoordinate: 0, cones: [], blueConeCount: 0, redConeCount: 0},
			{height: PoleHeight.LOW, xCoordinate: 1, yCoordinate: 0, cones: [], blueConeCount: 0, redConeCount: 0},
			{height: PoleHeight.GROUND, xCoordinate: 2, yCoordinate: 0, cones: [], blueConeCount: 0, redConeCount: 0},
			{height: PoleHeight.LOW, xCoordinate: 3, yCoordinate: 0, cones: [], blueConeCount: 0, redConeCount: 0},
			{height: PoleHeight.GROUND, xCoordinate: 4, yCoordinate: 0, cones: [], blueConeCount: 0, redConeCount: 0},
		],
	];
	let junctions: Pole[][] = structuredClone(originalJunctions);
	let actions: ConeAction[] = [];

	$: {
		console.log("actions", actions);
		console.log("junctions", junctions);
	}

	function addConeToPole(xCoordinate: number, yCoordinate: number, color: Alliance): void {
		console.log("addConeToPole", xCoordinate, yCoordinate);
		// for trigger reactivity
		actions = [...actions, {
			cone: {
				category: ConeType.REGULAR,
				color: color,
				xCoordinate: xCoordinate,
				yCoordinate: yCoordinate,
			},
			pole: structuredClone(junctions[yCoordinate][xCoordinate]),
		}];
		renderPole();
	}

	function undoAction(): void {
		console.log("undoAction");
		actions = actions.slice(0, actions.length - 1);
		renderPole();
	}

	function renderPole(): void {
		console.log("updatePole");

		let newJunctions: Pole[][] = structuredClone(originalJunctions);

		for (let i = 0; i < actions.length; i++) {
			// console.log(`action i ${i} for pole ${actions[i].pole.xCoordinate}, ${actions[i].pole.yCoordinate}`);
			let currentPole = newJunctions[actions[i].pole.yCoordinate][actions[i].pole.xCoordinate];
			if (actions[i].cone.color === Alliance.BLUE) {
				currentPole.blueConeCount++;
			} else {
				currentPole.redConeCount++;
			}
			currentPole.cones.push(actions[i].cone);
			newJunctions[actions[i].pole.yCoordinate][actions[i].pole.xCoordinate] = currentPole;
		}

		junctions = structuredClone(newJunctions);
	}
</script>

<section>
	{#each junctions as junctionRow, i}
		<div>
			<p>Row: {i}</p>
			{#each junctionRow as pole, j}
				<div class="pole">
					<p>
						Coordinates: {pole.xCoordinate},{pole.yCoordinate} |
						Height: {PoleHeight[pole.height]} |
						Blue: {pole.blueConeCount}
						Red: {pole.redConeCount}
						{#if pole.cones.length < 0}
							{#each pole.cones as cone}
								<span>{cone.color}</span>
							{/each}
						{/if}
						|
						<button on:click={() => addConeToPole(pole.xCoordinate, pole.yCoordinate, Alliance.BLUE)}>Add Blue</button>
						<button on:click={() => addConeToPole(pole.xCoordinate, pole.yCoordinate, Alliance.RED)}>Add Red</button>
					</p>
				</div>
			{/each}
		</div>
	{/each}

	<button on:click={undoAction}>Undo</button>
	<button on:click={renderPole}>Render</button>
	<button on:click={() => actions = []}>Clear</button>

	<hr>

	<h2>Recent Actions</h2>
	<table>
		<thead>
			<tr>
				<th>Color</th>
				<th>Coordinates</th>
			</tr>
		</thead>
		<tbody>
			{#each actions as action}
				<tr>
					<td>{Alliance[action.cone.color]}</td>
					<td>{action.cone.xCoordinate},{action.cone.yCoordinate}</td>
				</tr>
			{/each}
	</table>
</section>
